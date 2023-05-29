import app from '../app';
import supertest from 'supertest';
import { randomUUID } from 'crypto';
import * as db from '../db';
import User from '../../models/Users';
import Size from '../../models/Size';
import Location from '../../models/Location';
import mongoose from 'mongoose';
import Area from '../../models/Area';
import LegalEntity from '../../models/LegalEntity';
import Format from '../../models/Format';
import City from '../../models/City';
import Direction from '../../models/Direction';
import Region from '../../models/Region';
import Street from '../../models/Street';
import Lighting from '../../models/Lighting';
import regionsRouter from '../../routers/regions';

app.use('/regions', regionsRouter);
const request = supertest(app);

const adminToken = randomUUID();
const userToken = randomUUID();
const adminDto = {
  displayName: `admin`,
  email: `admin@mail.com`,
  role: 'admin',
  password: '@esdpjs17',
  token: adminToken,
};
const userDto = {
  displayName: `user name`,
  email: `user@mail.com`,
  role: 'user',
  password: '@esdpjs17',
  token: userToken,
};

describe('regionsRouter', () => {
  let regionIdWithNoRelationship: string;
  let regionIdRelatedToLocation: string;

  beforeAll(async () => {
    await db.connect();
  });

  beforeEach(async () => {
    await db.clear();
    await User.create(adminDto, userDto);
    const area = await Area.create({ name: 'area' });
    const city = await City.create({ name: 'city', area: area._id });
    const [notRelatedRegion, relatedRegion] = await Region.create(
      { name: 'region with no relationship', city: city._id },
      { name: 'region related to some location', city: city._id },
    );
    const [street1, street2] = await Street.create(
      { name: 'street1', city: city._id },
      { name: 'street2', city: city._id },
    );
    regionIdWithNoRelationship = notRelatedRegion._id.toString();
    regionIdRelatedToLocation = relatedRegion._id.toString();
    await Location.create({
      legalEntity: (await LegalEntity.create({ name: 'legal entity' }))._id,
      format: (await Format.create({ name: 'format' }))._id,
      direction: (await Direction.create({ name: 'direction' }))._id,
      lighting: (await Lighting.create({ name: 'lighting' }))._id,
      region: relatedRegion._id,
      size: (await Size.create({ name: '345x345' }))._id,
      area: area._id,
      city: city._id,
      streets: [street1._id, street2._id],
      placement: true,
      price: mongoose.Types.Decimal128.fromString('1000'),
      dayImage: 'some/path',
      schemaImage: 'some/path',
    });
  });

  afterAll(async () => {
    await db.disconnect();
  });

  describe('GET /regions', () => {
    test('неавторизованный пользователь пытается получить список, должен созвращать statusCode 401 и сообщение об ошибке', async () => {
      const res = await request.get(`/regions`);
      const errorMessage = res.body.error;

      expect(res.statusCode).toBe(401);
      expect(errorMessage).toBe('Отсутствует токен авторизации.');
    });

    test('пользователь с рандомным токеном пытается получить список, должен созвращать statusCode 401 и сообщение об ошибке', async () => {
      const res = await request.get(`/regions`).set({ Authorization: 'random-token' });
      const errorMessage = res.body.error;

      expect(res.statusCode).toBe(401);
      expect(errorMessage).toBe('Предоставлен неверный токен авторизации.');
    });

    test('пользователь с ролью "user" пытается получить список, должен созвращать statusCode 200 и список элементов длиной 2', async () => {
      const res = await request.get(`/regions`).set({ Authorization: userToken });
      const regionsList = res.body;

      expect(res.statusCode).toBe(200);
      expect(Array.isArray(regionsList)).toBe(true);
      expect(regionsList.length).toBe(2);
    });

    test('пользователь с ролью "admin" пытается получить список, должен созвращать statusCode 200 и список элементов длиной 2', async () => {
      const res = await request.get(`/regions`).set({ Authorization: adminToken });
      const regionsList = res.body;

      expect(res.statusCode).toBe(200);
      expect(Array.isArray(regionsList)).toBe(true);
      expect(regionsList.length).toBe(2);
    });

    test('элементы списка должны иметь свойства _id, name, city', async () => {
      const res = await request.get(`/regions`).set({ Authorization: adminToken });
      const regionsList: Record<string, string>[] = res.body;

      expect(res.statusCode).toBe(200);
      expect(
        regionsList.every(
          (region) =>
            mongoose.isValidObjectId(region._id) && mongoose.isValidObjectId(region.city) && region.name.length,
        ),
      ).toBe(true);
    });

    describe('GET /regions?cityId=id - авторизованный пользователь пытается получить список с query параметром cityId', () => {
      test('указав некорректный mongodb id city, должен возвращать statusCode 422 и сообщение об ошибке', async () => {
        const res = await request.get(`/regions?cityId=random-string`).set({ Authorization: adminToken });
        const errorMessage = res.body.error;

        expect(res.statusCode).toBe(422);
        expect(errorMessage).toBe('Некорректный id города.');
      });

      test('указав корректный, но не существующий mongodb id city, должен возвращать statusCode 200 и пустой список', async () => {
        const randomMongoId = new mongoose.Types.ObjectId().toString();
        const res = await request.get(`/regions?cityId=${randomMongoId}`).set({ Authorization: adminToken });
        const citiesList = res.body;

        expect(res.statusCode).toBe(200);
        expect(citiesList.length).toBe(0);
      });

      test('указав корректный mongodb id city, должен возвращать statusCode 200 и соответствующий параметру список', async () => {
        const area1 = await Area.create({ name: 'New Area' });
        const [city1, city2] = await City.create(
          { name: 'New City 1', area: area1._id },
          { name: 'New City 2', area: area1._id },
        );
        const [region1, region2] = await Region.create(
          { name: 'New Region 1', city: city1._id },
          { name: 'New Region 2', city: city1._id },
          { name: 'New Region 3', city: city2._id },
          { name: 'New Region 4', city: city2._id },
        );
        const res = await request.get(`/regions?cityId=${city1._id.toString()}`).set({ Authorization: adminToken });
        const regionsList: Record<string, string>[] = res.body;

        expect(regionsList.length).toBe(2);
        expect(regionsList.some((region) => region._id === region1._id.toString())).toBe(true);
        expect(regionsList.some((region) => region._id === region2._id.toString())).toBe(true);
        expect(regionsList.some((region) => region.name === region1.name.toString())).toBe(true);
        expect(regionsList.some((region) => region.name === region2.name.toString())).toBe(true);
        expect(regionsList.every((region) => region.city === city1._id.toString())).toBe(true);
      });
    });
  });

  describe('POST /regions', () => {
    test('неавторизованный пользователь пытается создать новую запись, должен возвращать statusCode 401 и сообщение об ошибке', async () => {
      const area = await Area.create({ name: 'New Area' });
      const city = await City.create({ name: 'New City', area: area._id });
      const createRegionDto = { name: 'New Region', city: city._id };
      const res = await request.post('/regions').send(createRegionDto);
      const errorMessage = res.body.error;

      expect(res.statusCode).toBe(401);
      expect(errorMessage).toBe('Отсутствует токен авторизации.');
    });

    test('пользователь с рандомным токеном пытается создать новую запись, должен возвращать statusCode 401 и сообщение об ошибке', async () => {
      const area = await Area.create({ name: 'New Area' });
      const city = await City.create({ name: 'New City', area: area._id });
      const createRegionDto = { name: 'New Region', city: city._id };
      const res = await request.post('/regions').set({ Authorization: 'some-random-token' }).send(createRegionDto);
      const errorMessage = res.body.error;

      expect(res.statusCode).toBe(401);
      expect(errorMessage).toBe('Предоставлен неверный токен авторизации.');
    });

    test('пользователь с ролью "user" пытается создать новую запись, должен возвращать statusCode 403 и сообщение об ошибке', async () => {
      const area = await Area.create({ name: 'New Area' });
      const city = await City.create({ name: 'New City', area: area._id });
      const createRegionDto = { name: 'New Region', city: city._id };
      const res = await request.post('/regions').set({ Authorization: userToken }).send(createRegionDto);
      const error = res.body.error;

      expect(res.statusCode).toBe(403);
      expect(error).toBe('Неавторизованный пользователь. Нет прав на совершение действия.');
    });

    describe('пользователь с ролью "admin" пытается создать новую запись', () => {
      test('с дублирующимися данными, должен возвращать statusCode 422 и сообщение об ошибке', async () => {
        const area = await Area.create({ name: 'New Area' });
        const city = await City.create({ name: 'New City', area: area._id });
        const duplicateDto = { name: 'Duplicate Region', city: city._id };
        await Region.create(duplicateDto);
        const res = await request.post('/regions').send(duplicateDto).set({ Authorization: adminToken });
        const validationError = res.body;

        expect(res.statusCode).toBe(422);
        expect(validationError.name).toBe('ValidationError');
        expect(validationError.errors.name).not.toBeUndefined();
      });

      test('с некорректными данными, должен возвращать statusCode 422 и сообщение об ошибке', async () => {
        const res = await request.post('/regions').send({ bla: 'bla' }).set({ Authorization: adminToken });
        const name = res.body.name;

        expect(res.statusCode).toBe(422);
        expect(name).toBe('ValidationError');
      });

      test('с корректными данными, дожен возвращать statusCode 201 и объект с сообщением и созданной записью', async () => {
        const area = await Area.create({ name: 'New Area' });
        const city = await City.create({ name: 'New City', area: area._id });
        const createRegionDto = { name: 'New Region', city: city._id };
        const res = await request.post('/regions').send(createRegionDto).set({ Authorization: adminToken });
        const { message, region } = res.body;

        expect(res.statusCode).toBe(201);
        expect(message).toBe('Новый район успешно создан!');
        expect(mongoose.isValidObjectId(region._id)).toBe(true);
        expect(region.city).toBe(city._id.toString());
        expect(region.name).toBe(createRegionDto.name);
      });
    });
  });

  describe('DELETE /regions/:id', () => {
    test('неавторизованный пользователь пытается удалить 1 запись, должен возвращать statusCode 401 и сообщение об ошибке', async () => {
      const res = await request.delete(`/regions/${regionIdWithNoRelationship}`);
      const errorMessage = res.body.error;

      expect(res.statusCode).toBe(401);
      expect(errorMessage).toBe('Отсутствует токен авторизации.');
    });

    test('пользователь с рандомным токеном пытается удалить 1 запись, должен возвращать statusCode 401 и сообщение об ошибке', async () => {
      const res = await request
        .delete(`/regions/${regionIdWithNoRelationship}`)
        .set({ Authorization: 'some-random-token' });
      const errorMessage = res.body.error;

      expect(res.statusCode).toBe(401);
      expect(errorMessage).toBe('Предоставлен неверный токен авторизации.');
    });

    test('пользователь с ролью "user" пытается удалить 1 запись, должен возвращать statusCode 403 и сообщение о недостаточных правах', async () => {
      const res = await request.delete(`/regions/${regionIdWithNoRelationship}`).set({ Authorization: userToken });
      const errorMessage = res.body.error;

      expect(res.statusCode).toBe(403);
      expect(errorMessage).toBe('Неавторизованный пользователь. Нет прав на совершение действия.');
    });

    describe('пользоваетель с ролью "admin" пытается удалить 1 запись', () => {
      test('указав некорректный mongodb id, должен возвращать statusCode 422 и сообщение об ошибке', async () => {
        const res = await request.delete(`/regions/random-string`).set({ Authorization: adminToken });
        const errorMessage = res.body.error;

        expect(res.statusCode).toBe(422);
        expect(errorMessage).toBe('Некорректный id района.');
      });

      test('указав корректный, но несуществующий в базе id, должен возвращать statusCode 404 и сообщение об ошибке', async () => {
        const randomMongoId = new mongoose.Types.ObjectId().toString();
        const res = await request.delete(`/regions/${randomMongoId}`).set({ Authorization: adminToken });
        const errorMessage = res.body.error;

        expect(res.statusCode).toBe(404);
        expect(errorMessage).toBe('Район не существует в базе.');
      });

      test('указав корректный id, но имеется связь, должен возвращать statusCode 409 и сообщение об ошибке', async () => {
        const res = await request.delete(`/regions/${regionIdRelatedToLocation}`).set({ Authorization: adminToken });
        const errorMessage = res.body.error;

        expect(res.statusCode).toBe(409);
        expect(errorMessage).toBe('Район привязан к локациям! Удаление запрещено.');
      });

      test('указав корректный id сущности без связей, должен возвращать statusCode 200 и объект с информацию об удалении со свойством deletedCount = 1', async () => {
        const res = await request.delete(`/regions/${regionIdWithNoRelationship}`).set({ Authorization: adminToken });
        const result = res.body;

        expect(res.statusCode).toBe(200);
        expect(result.deletedCount).toBe(1);
      });
    });
  });
});

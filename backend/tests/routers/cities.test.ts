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
import citiesRouter from '../../routers/cities';

app.use('/cities', citiesRouter);
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

describe('citiesRouter', () => {
  let cityIdWithNoRelationship: string;
  let cityIdWithRelatedStreets: string;
  let cityIdWithRelatedRegions: string;
  let cityIdRelatedToLocation: string;

  beforeAll(async () => {
    await db.connect();
  });

  beforeEach(async () => {
    await db.clear();
    await User.create(adminDto, userDto);
    const area = await Area.create({ name: 'area' });
    const [notRelatedCity, relatedCity, cityWithStreets, cityWithRegions] = await City.create(
      { name: 'city with no relationship', area: area._id },
      { name: 'city related to location', area: area._id },
      { name: 'city with related streets', area: area._id },
      { name: 'city with related regions', area: area._id },
    );
    await Region.create({ name: 'region', city: cityWithRegions._id });
    const [street1, street2] = await Street.create(
      { name: 'street1', city: relatedCity._id },
      { name: 'street2', city: relatedCity._id },
      { name: 'street3', city: cityWithStreets._id },
      { name: 'street4', city: cityWithStreets._id },
    );
    cityIdWithNoRelationship = notRelatedCity._id.toString();
    cityIdRelatedToLocation = relatedCity._id.toString();
    cityIdWithRelatedRegions = cityWithRegions._id.toString();
    cityIdWithRelatedStreets = cityWithStreets._id.toString();
    await Location.create({
      legalEntity: (await LegalEntity.create({ name: 'legal entity' }))._id,
      format: (await Format.create({ name: 'format' }))._id,
      direction: (await Direction.create({ name: 'direction' }))._id,
      lighting: (await Lighting.create({ name: 'lighting' }))._id,
      size: (await Size.create({ name: '345x345' }))._id,
      area: area._id,
      city: relatedCity._id,
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

  describe('GET /cities', () => {
    test('неавторизованный пользователь пытается получить список, должен созвращать statusCode 401 и сообщение об ошибке', async () => {
      const res = await request.get(`/cities`);
      const errorMessage = res.body.error;

      expect(res.statusCode).toBe(401);
      expect(errorMessage).toBe('Отсутствует токен авторизации.');
    });

    test('пользователь с рандомным токеном пытается получить список, должен созвращать statusCode 401 и сообщение об ошибке', async () => {
      const res = await request.get(`/cities`).set({ Authorization: 'random-token' });
      const errorMessage = res.body.error;

      expect(res.statusCode).toBe(401);
      expect(errorMessage).toBe('Предоставлен неверный токен авторизации.');
    });

    test('пользователь с ролью "user" пытается получить список, должен созвращать statusCode 200 и список элементов длиной 1', async () => {
      await City.deleteMany();
      await Area.deleteMany();
      const area = await Area.create({ name: 'area' });
      await City.create({ name: 'city', area: area._id });
      const res = await request.get(`/cities`).set({ Authorization: userToken });
      const citiesList = res.body;

      expect(res.statusCode).toBe(200);
      expect(Array.isArray(citiesList)).toBe(true);
      expect(citiesList.length).toBe(1);
    });

    test('пользователь с ролью "admin" пытается получить список, должен созвращать statusCode 200 и список элементов длиной 1', async () => {
      await City.deleteMany();
      await Area.deleteMany();
      const area = await Area.create({ name: 'area' });
      await City.create({ name: 'city', area: area._id });
      const res = await request.get(`/cities`).set({ Authorization: adminToken });
      const citiesList = res.body;

      expect(res.statusCode).toBe(200);
      expect(Array.isArray(citiesList)).toBe(true);
      expect(citiesList.length).toBe(1);
    });

    test('элементы списка должны иметь свойства _id, name, area', async () => {
      await Area.deleteMany();
      await City.deleteMany();
      const area = await Area.create({ name: 'area' });
      const createdCity = await City.create({ name: 'city', area: area._id });
      const res = await request.get(`/cities`).set({ Authorization: adminToken });
      const citiesList = res.body;
      const city = citiesList[0];

      expect(res.statusCode).toBe(200);
      expect(citiesList.length).toBe(1);
      expect(city._id).toBe(createdCity._id.toString());
      expect(city.name).toBe(createdCity.name);
      expect(city.area).toBe(area._id.toString());
    });

    describe('GET /cities?areaId=id - авторизованный пользователь пытается получить список с query параметром area', () => {
      test('указав некорректный mongodb id area, должен возвращать statusCode 422 и сообщение об ошибке', async () => {
        const res = await request.get(`/cities?areaId=random-string`).set({ Authorization: adminToken });
        const errorMessage = res.body.error;

        expect(res.statusCode).toBe(422);
        expect(errorMessage).toBe('Некорректный id области.');
      });

      test('указав корректный mongodb, но не существующий id area, должен возвращать statusCode 200 и пустой список', async () => {
        const randomMongoId = new mongoose.Types.ObjectId().toString();
        const res = await request.get(`/cities?areaId=${randomMongoId}`).set({ Authorization: adminToken });
        const citiesList = res.body;

        expect(res.statusCode).toBe(200);
        expect(citiesList.length).toBe(0);
      });

      test('указав корректный mongodb id area, должен возвращать statusCode 200 и соответствующий параметру список', async () => {
        await Area.deleteMany();
        await City.deleteMany();
        const [area1, area2] = await Area.create({ name: 'area1' }, { name: 'area2' });
        const [city1, city2] = await City.create(
          { name: 'city1', area: area1._id },
          { name: 'city2', area: area1._id },
          { name: 'city3', area: area2._id },
          { name: 'city4', area: area2._id },
        );
        const res = await request.get(`/cities?areaId=${area1._id.toString()}`).set({ Authorization: adminToken });
        const citiesList: Record<string, string>[] = res.body;

        expect(citiesList.length).toBe(2);
        expect(citiesList.some((city) => city._id === city1._id.toString())).toBe(true);
        expect(citiesList.some((city) => city._id === city2._id.toString())).toBe(true);
        expect(citiesList.some((city) => city.name === city2.name.toString())).toBe(true);
        expect(citiesList.some((city) => city.name === city2.name.toString())).toBe(true);
        expect(citiesList.every((city) => city.area === area1._id.toString())).toBe(true);
      });
    });
  });

  describe('POST /cities', () => {
    test('неавторизованный пользователь пытается создать новую запись, должен возвращать statusCode 401 и сообщение об ошибке', async () => {
      await Area.deleteMany();
      await City.deleteMany();
      const area = await Area.create({ name: 'area' });
      const res = await request.post('/cities').send({ name: 'new city', area: area._id.toString() });
      const errorMessage = res.body.error;

      expect(res.statusCode).toBe(401);
      expect(errorMessage).toBe('Отсутствует токен авторизации.');
    });

    test('пользователь с рандомным токеном пытается создать новую запись, должен возвращать statusCode 401 и сообщение об ошибке', async () => {
      await Area.deleteMany();
      await City.deleteMany();
      const area = await Area.create({ name: 'area' });
      const res = await request
        .post('/cities')
        .send({ name: 'new city', area: area._id.toString() })
        .set({ Authorization: 'some-random-token' });
      const errorMessage = res.body.error;

      expect(res.statusCode).toBe(401);
      expect(errorMessage).toBe('Предоставлен неверный токен авторизации.');
    });

    test('пользователь с ролью "user" пытается создать новую запись, должен возвращать statusCode 403 и сообщение об ошибке', async () => {
      await Area.deleteMany();
      await City.deleteMany();
      const area = await Area.create({ name: 'area' });
      const res = await request
        .post('/cities')
        .send({ name: 'new city', area: area._id.toString() })
        .set({ Authorization: userToken });
      const error = res.body.error;

      expect(res.statusCode).toBe(403);
      expect(error).toBe('Неавторизованный пользователь. Нет прав на совершение действия.');
    });

    describe('пользователь с ролью "admin" пытается создать новую запись', () => {
      test('с дублирующимися данными, должен возвращать statusCode 422 и сообщение об ошибке', async () => {
        await Area.deleteMany();
        await City.deleteMany();
        const area = await Area.create({ name: 'area' });
        const duplicateDto = { name: 'duplicate city name', area: area._id.toString() };
        await City.create(duplicateDto);
        const res = await request.post('/cities').send(duplicateDto).set({ Authorization: adminToken });
        const validationError = res.body;

        expect(res.statusCode).toBe(422);
        expect(validationError.name).toBe('ValidationError');
        expect(validationError.errors.name).not.toBeUndefined();
      });

      test('с некорректными данными, должен возвращать statusCode 422 и сообщение об ошибке', async () => {
        const res = await request.post('/cities').send({ bla: 'bla' }).set({ Authorization: adminToken });
        const name = res.body.name;

        expect(res.statusCode).toBe(422);
        expect(name).toBe('ValidationError');
      });

      test('с корректными данными, дожен возвращать statusCode 201 и объект с сообщением и созданной записью', async () => {
        await Area.deleteMany();
        await City.deleteMany();
        const area = await Area.create({ name: 'area' });
        const createCityDto = { name: 'new city', area: area._id.toString() };
        const res = await request.post('/cities').send(createCityDto).set({ Authorization: adminToken });
        const { message, city } = res.body;

        expect(res.statusCode).toBe(201);
        expect(message).toBe('Новый город успешно создан!');
        expect(typeof city._id === 'string').toBe(true);
        expect(city.name).toBe(createCityDto.name);
        expect(city.area).toBe(area._id.toString());
      });
    });
  });

  describe('DELETE /cities/:id', () => {
    test('неавторизованный пользователь пытается удалить 1 запись, должен возвращать statusCode 401 и сообщение об ошибке', async () => {
      const res = await request.delete(`/cities/${cityIdWithNoRelationship}`);
      const errorMessage = res.body.error;

      expect(res.statusCode).toBe(401);
      expect(errorMessage).toBe('Отсутствует токен авторизации.');
    });

    test('пользователь с рандомным токеном пытается удалить 1 запись, должен возвращать statusCode 401 и сообщение об ошибке', async () => {
      const res = await request
        .delete(`/cities/${cityIdWithNoRelationship}`)
        .set({ Authorization: 'some-random-token' });
      const errorMessage = res.body.error;

      expect(res.statusCode).toBe(401);
      expect(errorMessage).toBe('Предоставлен неверный токен авторизации.');
    });

    test('пользователь с ролью "user" пытается удалить 1 запись, должен возвращать statusCode 403 и сообщение о недостаточных правах', async () => {
      const res = await request.delete(`/cities/${cityIdWithNoRelationship}`).set({ Authorization: userToken });
      const errorMessage = res.body.error;

      expect(res.statusCode).toBe(403);
      expect(errorMessage).toBe('Неавторизованный пользователь. Нет прав на совершение действия.');
    });

    describe('пользоваетель с ролью "admin" пытается удалить 1 запись', () => {
      test('указав некорректный mongodb id, должен возвращать statusCode 422 и сообщение об ошибке', async () => {
        const res = await request.delete(`/cities/random-string`).set({ Authorization: adminToken });
        const errorMessage = res.body.error;

        expect(res.statusCode).toBe(422);
        expect(errorMessage).toBe('Некорректный id города.');
      });

      test('указав корректный, но несуществующий в базе id, должен возвращать statusCode 404 и сообщение об ошибке', async () => {
        const randomMongoId = new mongoose.Types.ObjectId().toString();
        const res = await request.delete(`/cities/${randomMongoId}`).set({ Authorization: adminToken });
        const errorMessage = res.body.error;

        expect(res.statusCode).toBe(404);
        expect(errorMessage).toBe('Город не существует в базе.');
      });

      test('указав корректный id, но имеется связь с локациями, должен возвращать statusCode 409 и сообщение об ошибке', async () => {
        const res = await request.delete(`/cities/${cityIdRelatedToLocation}`).set({ Authorization: adminToken });
        const errorMessage = res.body.error;

        expect(res.statusCode).toBe(409);
        expect(errorMessage).toBe('Город привязан к другим сущностям! Удаление запрещено.');
      });

      test('указав корректный id, но имеется связь с улицами, должен возвращать statusCode 409 и сообщение об ошибке', async () => {
        const res = await request.delete(`/cities/${cityIdWithRelatedStreets}`).set({ Authorization: adminToken });
        const errorMessage = res.body.error;

        expect(res.statusCode).toBe(409);
        expect(errorMessage).toBe('Город привязан к другим сущностям! Удаление запрещено.');
      });

      test('указав корректный id, но имеется связь с районами, должен возвращать statusCode 409 и сообщение об ошибке', async () => {
        const res = await request.delete(`/cities/${cityIdWithRelatedRegions}`).set({ Authorization: adminToken });
        const errorMessage = res.body.error;

        expect(res.statusCode).toBe(409);
        expect(errorMessage).toBe('Город привязан к другим сущностям! Удаление запрещено.');
      });

      test('указав корректный id сущности без связей, должен возвращать statusCode 200 и объект с информацию об удалении со свойством deletedCount = 1', async () => {
        const res = await request.delete(`/cities/${cityIdWithNoRelationship}`).set({ Authorization: adminToken });
        const result = res.body;

        expect(res.statusCode).toBe(200);
        expect(result.deletedCount).toBe(1);
      });
    });
  });
});

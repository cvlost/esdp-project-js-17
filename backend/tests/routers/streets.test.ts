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
import Street from '../../models/Street';
import Lighting from '../../models/Lighting';
import streetsRouter from '../../routers/streets';

app.use('/streets', streetsRouter);
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

describe('streetsRouter', () => {
  let streetIdWithNoRelationship: string;
  let streetIdRelatedToLocation: string;
  beforeAll(async () => {
    await db.connect();
  });
  beforeEach(async () => {
    await db.clear();
    await User.create(adminDto, userDto);
    const area = await Area.create({ name: 'area' });
    const city = await City.create({ name: 'city', area: area._id });
    const [notRelatedStreet, relatedStreet, relatedStreet2] = await Street.create(
      { name: 'street with no relationship', city: city._id },
      { name: 'street 1 related to some location', city: city._id },
      { name: 'street 2 related to some location', city: city._id },
    );
    streetIdWithNoRelationship = notRelatedStreet._id.toString();
    streetIdRelatedToLocation = relatedStreet._id.toString();
    await Location.create({
      legalEntity: (await LegalEntity.create({ name: 'legal entity' }))._id,
      format: (await Format.create({ name: 'format' }))._id,
      direction: (await Direction.create({ name: 'direction' }))._id,
      lighting: (await Lighting.create({ name: 'lighting' }))._id,
      size: (await Size.create({ name: '345x345' }))._id,
      area: area._id,
      city: city._id,
      streets: [relatedStreet._id, relatedStreet2._id],
      placement: true,
      price: mongoose.Types.Decimal128.fromString('1000'),
      dayImage: 'some/path',
      schemaImage: 'some/path',
    });
  });
  afterAll(async () => {
    await db.disconnect();
  });

  describe('GET /streets', () => {
    test('неавторизованный пользователь пытается получить список, должен созвращать statusCode 401 и сообщение об ошибке', async () => {
      const res = await request.get(`/streets`);
      const errorMessage = res.body.error;
      expect(res.statusCode).toBe(401);
      expect(errorMessage).toBe('Отсутствует токен авторизации.');
    });
    test('пользователь с рандомным токеном пытается получить список, должен созвращать statusCode 401 и сообщение об ошибке', async () => {
      const res = await request.get(`/streets`).set({ Authorization: 'random-token' });
      const errorMessage = res.body.error;
      expect(res.statusCode).toBe(401);
      expect(errorMessage).toBe('Предоставлен неверный токен авторизации.');
    });
    test('пользователь с ролью "user" пытается получить список, должен созвращать statusCode 200 и список элементов длиной 3', async () => {
      const res = await request.get(`/streets`).set({ Authorization: userToken });
      const streetsList = res.body;
      expect(res.statusCode).toBe(200);
      expect(Array.isArray(streetsList)).toBe(true);
      expect(streetsList.length).toBe(3);
    });
    test('пользователь с ролью "admin" пытается получить список, должен созвращать statusCode 200 и список элементов длиной 3', async () => {
      const res = await request.get(`/streets`).set({ Authorization: adminToken });
      const streetsList = res.body;
      expect(res.statusCode).toBe(200);
      expect(Array.isArray(streetsList)).toBe(true);
      expect(streetsList.length).toBe(3);
    });
    test('элементы списка должны иметь свойства _id, name, city', async () => {
      const res = await request.get(`/streets`).set({ Authorization: adminToken });
      const streetsList: Record<string, string>[] = res.body;
      expect(res.statusCode).toBe(200);
      expect(
        streetsList.every(
          (street) =>
            mongoose.isValidObjectId(street._id) && mongoose.isValidObjectId(street.city) && street.name.length,
        ),
      ).toBe(true);
    });

    describe('GET /streets?cityId=id - авторизованный пользователь пытается получить список с query параметром cityId', () => {
      test('указав некорректный mongodb id city, должен возвращать statusCode 422 и сообщение об ошибке', async () => {
        const res = await request.get(`/streets?cityId=random-string`).set({ Authorization: adminToken });
        const errorMessage = res.body.error;
        expect(res.statusCode).toBe(422);
        expect(errorMessage).toBe('Некорректный id города.');
      });
      test('указав корректный, но не существующий mongodb id city, должен возвращать statusCode 200 и пустой список', async () => {
        const randomMongoId = new mongoose.Types.ObjectId().toString();
        const res = await request.get(`/streets?cityId=${randomMongoId}`).set({ Authorization: adminToken });
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
        const [street1, street2] = await Street.create(
          { name: 'New Street 1', city: city1._id },
          { name: 'New Street 2', city: city1._id },
          { name: 'New Street 3', city: city2._id },
          { name: 'New Street 4', city: city2._id },
        );
        const res = await request.get(`/streets?cityId=${city1._id.toString()}`).set({ Authorization: adminToken });
        const streetsList: Record<string, string>[] = res.body;
        expect(streetsList.length).toBe(2);
        expect(streetsList.some((street) => street._id === street1._id.toString())).toBe(true);
        expect(streetsList.some((street) => street._id === street2._id.toString())).toBe(true);
        expect(streetsList.some((street) => street.name === street1.name.toString())).toBe(true);
        expect(streetsList.some((street) => street.name === street2.name.toString())).toBe(true);
        expect(streetsList.every((street) => street.city === city1._id.toString())).toBe(true);
      });
    });
  });

  describe('POST /streets', () => {
    test('неавторизованный пользователь пытается создать новую запись, должен возвращать statusCode 401 и сообщение об ошибке', async () => {
      const area = await Area.create({ name: 'New Area' });
      const city = await City.create({ name: 'New City', area: area._id });
      const createStreetDto = { name: 'New Street', city: city._id };
      const res = await request.post('/streets').send(createStreetDto);
      const errorMessage = res.body.error;
      expect(res.statusCode).toBe(401);
      expect(errorMessage).toBe('Отсутствует токен авторизации.');
    });
    test('пользователь с рандомным токеном пытается создать новую запись, должен возвращать statusCode 401 и сообщение об ошибке', async () => {
      const area = await Area.create({ name: 'New Area' });
      const city = await City.create({ name: 'New City', area: area._id });
      const createStreetDto = { name: 'New Street', city: city._id };
      const res = await request.post('/streets').set({ Authorization: 'some-random-token' }).send(createStreetDto);
      const errorMessage = res.body.error;
      expect(res.statusCode).toBe(401);
      expect(errorMessage).toBe('Предоставлен неверный токен авторизации.');
    });
    test('пользователь с ролью "user" пытается создать новую запись, должен возвращать statusCode 403 и сообщение об ошибке', async () => {
      const area = await Area.create({ name: 'New Area' });
      const city = await City.create({ name: 'New City', area: area._id });
      const createStreetDto = { name: 'New Street', city: city._id };
      const res = await request.post('/streets').set({ Authorization: userToken }).send(createStreetDto);
      const error = res.body.error;
      expect(res.statusCode).toBe(403);
      expect(error).toBe('Неавторизованный пользователь. Нет прав на совершение действия.');
    });

    describe('пользователь с ролью "admin" пытается создать новую запись', () => {
      test('с дублирующимися данными, должен возвращать statusCode 422 и сообщение об ошибке', async () => {
        const area = await Area.create({ name: 'New Area' });
        const city = await City.create({ name: 'New City', area: area._id });
        const duplicateDto = { name: 'Duplicate Street', city: city._id };
        await Street.create(duplicateDto);
        const res = await request.post('/streets').send(duplicateDto).set({ Authorization: adminToken });
        const validationError = res.body;
        expect(res.statusCode).toBe(422);
        expect(validationError.name).toBe('ValidationError');
        expect(validationError.errors.name).not.toBeUndefined();
      });
      test('с некорректными данными, должен возвращать statusCode 422 и сообщение об ошибке', async () => {
        const res = await request.post('/streets').send({ bla: 'bla' }).set({ Authorization: adminToken });
        const name = res.body.name;
        expect(res.statusCode).toBe(422);
        expect(name).toBe('ValidationError');
      });
      test('с корректными данными, дожен возвращать statusCode 201 и объект с сообщением и созданной записью', async () => {
        const area = await Area.create({ name: 'New Area' });
        const city = await City.create({ name: 'New City', area: area._id });
        const createStreetDto = { name: 'New Street', city: city._id };
        const res = await request.post('/streets').send(createStreetDto).set({ Authorization: adminToken });
        const { message, street } = res.body;
        expect(res.statusCode).toBe(201);
        expect(message).toBe('Новая улица успешно создана!');
        expect(mongoose.isValidObjectId(street._id)).toBe(true);
        expect(street.city).toBe(city._id.toString());
        expect(street.name).toBe(createStreetDto.name);
      });
    });
  });

  describe('DELETE /streets/:id', () => {
    test('неавторизованный пользователь пытается удалить 1 запись, должен возвращать statusCode 401 и сообщение об ошибке', async () => {
      const res = await request.delete(`/streets/${streetIdWithNoRelationship}`);
      const errorMessage = res.body.error;
      expect(res.statusCode).toBe(401);
      expect(errorMessage).toBe('Отсутствует токен авторизации.');
    });
    test('пользователь с рандомным токеном пытается удалить 1 запись, должен возвращать statusCode 401 и сообщение об ошибке', async () => {
      const res = await request
        .delete(`/streets/${streetIdWithNoRelationship}`)
        .set({ Authorization: 'some-random-token' });
      const errorMessage = res.body.error;
      expect(res.statusCode).toBe(401);
      expect(errorMessage).toBe('Предоставлен неверный токен авторизации.');
    });
    test('пользователь с ролью "user" пытается удалить 1 запись, должен возвращать statusCode 403 и сообщение о недостаточных правах', async () => {
      const res = await request.delete(`/streets/${streetIdWithNoRelationship}`).set({ Authorization: userToken });
      const errorMessage = res.body.error;
      expect(res.statusCode).toBe(403);
      expect(errorMessage).toBe('Неавторизованный пользователь. Нет прав на совершение действия.');
    });

    describe('пользоваетель с ролью "admin" пытается удалить 1 запись', () => {
      test('указав некорректный mongodb id, должен возвращать statusCode 422 и сообщение об ошибке', async () => {
        const res = await request.delete(`/streets/random-string`).set({ Authorization: adminToken });
        const errorMessage = res.body.error;
        expect(res.statusCode).toBe(422);
        expect(errorMessage).toBe('Некорректный id улицы.');
      });
      test('указав корректный, но несуществующий в базе id, должен возвращать statusCode 404 и сообщение об ошибке', async () => {
        const randomMongoId = new mongoose.Types.ObjectId().toString();
        const res = await request.delete(`/streets/${randomMongoId}`).set({ Authorization: adminToken });
        const errorMessage = res.body.error;
        expect(res.statusCode).toBe(404);
        expect(errorMessage).toBe('Улица не существует в базе.');
      });
      test('указав корректный id, но имеется связь, должен возвращать statusCode 409 и сообщение об ошибке', async () => {
        const res = await request.delete(`/streets/${streetIdRelatedToLocation}`).set({ Authorization: adminToken });
        const errorMessage = res.body.error;
        expect(res.statusCode).toBe(409);
        expect(errorMessage).toBe('Улица привязана к локациям! Удаление запрещено.');
      });
      test('указав корректный id сущности без связей, должен возвращать statusCode 200 и объект с информацию об удалении со свойством deletedCount = 1', async () => {
        const res = await request.delete(`/streets/${streetIdWithNoRelationship}`).set({ Authorization: adminToken });
        const result = res.body;
        expect(res.statusCode).toBe(200);
        expect(result.deletedCount).toBe(1);
      });
    });
  });

  describe('PUT /streets/:id', () => {
    test('неавторизованный пользователь пытается редактировать 1 запись, должен возвращать statusCode 401 и сообщение об ошибке', async () => {
      const res = await request
        .put(`/streets/${streetIdWithNoRelationship}`)
        .send({ name: 'Updated name by anonymous' });
      const errorMessage = res.body.error;

      expect(res.statusCode).toBe(401);
      expect(errorMessage).toBe('Отсутствует токен авторизации.');
    });
    test('пользователь с рандомным токеном пытается редактировать 1 запись, должен возвращать statusCode 401 и сообщение об ошибке', async () => {
      const res = await request
        .put(`/streets/${streetIdWithNoRelationship}`)
        .set({ Authorization: 'some-random-token' })
        .send({ name: 'Updated name by anonymous with random token' });
      const errorMessage = res.body.error;

      expect(res.statusCode).toBe(401);
      expect(errorMessage).toBe('Предоставлен неверный токен авторизации.');
    });

    describe('авторизованный пользователь пытается редактировать 1 запись', () => {
      test('указав некорректный mongodb id, должен возвращать statusCode 422 и сообщение об ошибке', async () => {
        const res = await request
          .put(`/streets/random-string`)
          .set({ Authorization: adminToken })
          .send({ name: 'Updated name by admin' });
        const errorMessage = res.body.error;

        expect(res.statusCode).toBe(422);
        expect(errorMessage).toBe('Некорректный id улицы.');
      });
      test('указав корректный, но несуществующий в базе id, должен возвращать statusCode 404 и сообщение об ошибке', async () => {
        const randomMongoId = new mongoose.Types.ObjectId().toString();
        const res = await request
          .put(`/streets/${randomMongoId}`)
          .set({ Authorization: adminToken })
          .send({ name: 'Updated name by admin' });
        const errorMessage = res.body.error;
        expect(res.statusCode).toBe(404);
        expect(errorMessage).toBe('Улица не существует в базе.');
      });
      test('указав корректный id и валидные данные, должен возвращать statusCode 200 и объект измененной записи', async () => {
        const updateDto = { name: 'updated street 1' };
        const res = await request
          .put(`/streets/${streetIdWithNoRelationship}`)
          .set({ Authorization: adminToken })
          .send(updateDto);

        expect(res.statusCode).toBe(200);

        const updatedStreet = await Street.findById(streetIdWithNoRelationship);
        expect(updatedStreet).toBeTruthy();

        if (updatedStreet) {
          expect(updatedStreet.name).toBe(updateDto.name);
        }
      });
    });
  });
});

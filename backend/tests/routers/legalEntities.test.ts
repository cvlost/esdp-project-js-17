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
import legalEntitiesRouter from '../../routers/legalEntities';

app.use('/legalEntities', legalEntitiesRouter);
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
const createLegalEntityDto = { name: 'new test legal entity' };

describe('legalEntitiesRouter', () => {
  let entityIdNotRelatedToLocation: string;
  let entityIdRelatedToLocation: string;

  beforeAll(async () => {
    await db.connect();
  });

  beforeEach(async () => {
    await db.clear();
    await User.create(adminDto, userDto);
    const [notRelatedEntity, relatedEntity] = await LegalEntity.create(
      { name: 'legal entity 1' },
      { name: 'legal entity 2' },
    );
    const area = await Area.create({ name: 'area' });
    const city = await City.create({ name: 'city', area: area._id });
    const region = await Region.create({ name: 'region', city: city._id });
    const [street1, street2] = await Street.create(
      { name: 'street1', city: city._id },
      { name: 'street2', city: city._id },
    );
    entityIdNotRelatedToLocation = notRelatedEntity._id.toString();
    entityIdRelatedToLocation = relatedEntity._id.toString();
    await Location.create({
      legalEntity: relatedEntity._id,
      format: (await Format.create({ name: 'format' }))._id,
      direction: (await Direction.create({ name: 'direction' }))._id,
      lighting: (await Lighting.create({ name: 'lighting' }))._id,
      region: region._id,
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

  describe('GET /legalEntities', () => {
    test('неавторизованный пользователь пытается получить список, должен созвращать statusCode 401 и сообщение об ошибке', async () => {
      const res = await request.get(`/legalEntities`);
      const errorMessage = res.body.error;

      expect(res.statusCode).toBe(401);
      expect(errorMessage).toBe('Отсутствует токен авторизации.');
    });

    test('пользователь с рандомным токеном пытается получить список, должен созвращать statusCode 401 и сообщение об ошибке', async () => {
      const res = await request.get(`/legalEntities`).set({ Authorization: 'random-token' });
      const errorMessage = res.body.error;

      expect(res.statusCode).toBe(401);
      expect(errorMessage).toBe('Предоставлен неверный токен авторизации.');
    });

    test('пользователь с ролью "user" пытается получить список, должен созвращать statusCode 200 и список элементов длиной 1', async () => {
      await LegalEntity.deleteMany();
      await LegalEntity.create(createLegalEntityDto);
      const res = await request.get(`/legalEntities`).set({ Authorization: userToken });
      const legalEntitiesList = res.body;

      expect(res.statusCode).toBe(200);
      expect(Array.isArray(legalEntitiesList)).toBe(true);
      expect(legalEntitiesList.length).toBe(1);
    });

    test('пользователь с ролью "admin" пытается получить список, должен созвращать statusCode 200 и список элементов длиной 1', async () => {
      await LegalEntity.deleteMany();
      await LegalEntity.create(createLegalEntityDto);
      const res = await request.get(`/legalEntities`).set({ Authorization: adminToken });
      const legalEntitiesList = res.body;

      expect(res.statusCode).toBe(200);
      expect(Array.isArray(legalEntitiesList)).toBe(true);
      expect(legalEntitiesList.length).toBe(1);
    });

    test('элементы списка должны иметь свойства _id и name', async () => {
      await LegalEntity.deleteMany();
      const createdLegalEntity = await LegalEntity.create(createLegalEntityDto);
      const res = await request.get(`/legalEntities`).set({ Authorization: adminToken });
      const legalEntitiesList = res.body;
      const legalEntity = legalEntitiesList[0];

      expect(res.statusCode).toBe(200);
      expect(legalEntitiesList.length).toBe(1);
      expect(legalEntity._id).not.toBeUndefined();
      expect(legalEntity._id).toBe(createdLegalEntity._id.toString());
      expect(legalEntity.name).not.toBeUndefined();
      expect(legalEntity.name).toBe(createLegalEntityDto.name);
    });
  });

  describe('GET /legalEntities/:id', () => {
    test('неавторизованный пользователь пытается получить 1 запись, должен возвращать statusCode 401 и сообщение об ошибке', async () => {
      const res = await request.get(`/legalEntities/${entityIdRelatedToLocation}`);
      const errorMessage = res.body.error;

      expect(res.statusCode).toBe(401);
      expect(errorMessage).toBe('Отсутствует токен авторизации.');
    });

    test('пользователь с рандомным токеном пытается получить 1 запись, должен возвращать statusCode 401 и сообщение об ошибке', async () => {
      const res = await request
        .get(`/legalEntities/${entityIdRelatedToLocation}`)
        .set({ Authorization: 'random-token' });
      const errorMessage = res.body.error;

      expect(res.statusCode).toBe(401);
      expect(errorMessage).toBe('Предоставлен неверный токен авторизации.');
    });

    test('пользователь с ролью "user" пытается получить 1 запись, должен возвращать statusCode 200 и объект записи', async () => {
      await LegalEntity.deleteMany();
      const createdLegalEntity = await LegalEntity.create(createLegalEntityDto);
      const id = createdLegalEntity._id.toString();
      const res = await request.get(`/legalEntities/${id}`).set({ Authorization: userToken });
      const legalEntity = res.body;

      expect(res.statusCode).toBe(200);
      expect(legalEntity._id).toBe(id);
      expect(legalEntity.name).toBe(createdLegalEntity.name);
    });

    test('пользователь с ролью "admin" пытатеся получить 1 запись, должен возвращать statusCode 200 и объект записи', async () => {
      await LegalEntity.deleteMany();
      const createdLegalEntity = await LegalEntity.create(createLegalEntityDto);
      const id = createdLegalEntity._id.toString();
      const res = await request.get(`/legalEntities/${id}`).set({ Authorization: adminToken });
      const legalEntity = res.body;

      expect(res.statusCode).toBe(200);
      expect(legalEntity._id).toBe(id);
      expect(legalEntity.name).toBe(createdLegalEntity.name);
    });

    test('если передан некорректный по форме mongodb id, должен возвращать statusCode 422 и сообщение об ошибке', async () => {
      const res = await request.get(`/legalEntities/some-random-string`).set({ Authorization: adminToken });
      const errorMessage = res.body.error;

      expect(res.statusCode).toBe(422);
      expect(errorMessage).toBe('Некорректный id юридического лица.');
    });

    test('если передан корректный, но несуществующий в базе id, должен возвращать statusCode 404 и сообщение об ошибке', async () => {
      const id = new mongoose.Types.ObjectId().toString();
      const res = await request.get(`/legalEntities/${id}`).set({ Authorization: adminToken });
      const errorMessage = res.body.error;

      expect(res.statusCode).toBe(404);
      expect(errorMessage).toBe('Такое юридическое лицо не существует в базе.');
    });
  });

  describe('POST /legalEntities', () => {
    test('неавторизованный пользователь пытается создать новую запись, должен возвращать statusCode 401 и сообщение об ошибке', async () => {
      const res = await request.post('/legalEntities').send(createLegalEntityDto);
      const errorMessage = res.body.error;

      expect(res.statusCode).toBe(401);
      expect(errorMessage).toBe('Отсутствует токен авторизации.');
    });

    test('пользователь с рандомным токеном пытается создать новую запись, должен возвращать statusCode 401 и сообщение об ошибке', async () => {
      const res = await request
        .post('/legalEntities')
        .set({ Authorization: 'some-random-token' })
        .send(createLegalEntityDto);
      const errorMessage = res.body.error;

      expect(res.statusCode).toBe(401);
      expect(errorMessage).toBe('Предоставлен неверный токен авторизации.');
    });

    test('пользователь с ролью "user" пытается создать новую запись, должен возвращать statusCode 403 и сообщение об ошибке', async () => {
      const res = await request.post('/legalEntities').set({ Authorization: userToken }).send(createLegalEntityDto);
      const error = res.body.error;

      expect(res.statusCode).toBe(403);
      expect(error).toBe('Неавторизованный пользователь. Нет прав на совершение действия.');
    });

    describe('пользователь с ролью "admin" пытается создать новую запись', () => {
      test('с дублирующимися данными, должен возвращать statusCode 422 и сообщение об ошибке', async () => {
        const duplicateDto = { name: 'duplicate name' };
        await LegalEntity.create(duplicateDto);
        const res = await request.post('/legalEntities').send(duplicateDto).set({ Authorization: adminToken });
        const validationError = res.body;

        expect(res.statusCode).toBe(422);
        expect(validationError.name).toBe('ValidationError');
        expect(validationError.errors.name).not.toBeUndefined();
      });

      test('с некорректными данными, должен возвращать statusCode 422 и сообщение об ошибке', async () => {
        const res = await request.post('/legalEntities').send({ bla: 'bla' }).set({ Authorization: adminToken });
        const name = res.body.name;

        expect(res.statusCode).toBe(422);
        expect(name).toBe('ValidationError');
      });

      test('с корректными данными, дожен возвращать statusCode 201 и объект с сообщением и созданной записью', async () => {
        await LegalEntity.deleteMany();
        const res = await request.post('/legalEntities').send(createLegalEntityDto).set({ Authorization: adminToken });
        const { message, legalEntity } = res.body;

        expect(res.statusCode).toBe(201);
        expect(message).toBe('Новое юридическое лицо успешно создано!');
        expect(legalEntity._id).not.toBeUndefined();
        expect(typeof legalEntity._id === 'string').toBe(true);
        expect(legalEntity.name).not.toBeUndefined();
        expect(legalEntity.name).toBe(createLegalEntityDto.name);
      });
    });
  });

  describe('DELETE /legalEntities/:id', () => {
    test('неавторизованный пользователь пытается удалить 1 запись, должен возвращать statusCode 401 и сообщение об ошибке', async () => {
      const res = await request.delete(`/legalEntities/${entityIdNotRelatedToLocation}`);
      const errorMessage = res.body.error;

      expect(res.statusCode).toBe(401);
      expect(errorMessage).toBe('Отсутствует токен авторизации.');
    });

    test('пользователь с рандомным токеном пытается удалить 1 запись, должен возвращать statusCode 401 и сообщение об ошибке', async () => {
      const res = await request
        .delete(`/legalEntities/${entityIdNotRelatedToLocation}`)
        .set({ Authorization: 'some-random-token' });
      const errorMessage = res.body.error;

      expect(res.statusCode).toBe(401);
      expect(errorMessage).toBe('Предоставлен неверный токен авторизации.');
    });

    test('пользователь с ролью "user" пытается удалить 1 запись, должен возвращать statusCode 403 и сообщение о недостаточных правах', async () => {
      const res = await request
        .delete(`/legalEntities/${entityIdNotRelatedToLocation}`)
        .set({ Authorization: userToken });
      const errorMessage = res.body.error;

      expect(res.statusCode).toBe(403);
      expect(errorMessage).toBe('Неавторизованный пользователь. Нет прав на совершение действия.');
    });

    describe('пользоваетель с ролью "admin" пытается удалить 1 запись', () => {
      test('указав некорректный mongodb id, должен возвращать statusCode 422 и сообщение об ошибке', async () => {
        const res = await request.delete(`/legalEntities/random-string`).set({ Authorization: adminToken });
        const errorMessage = res.body.error;

        expect(res.statusCode).toBe(422);
        expect(errorMessage).toBe('Некорректный id юридического лица.');
      });

      test('указав корректный, но несуществующий в базе id, должен возвращать statusCode 404 и сообщение об ошибке', async () => {
        const randomMongoId = new mongoose.Types.ObjectId().toString();
        const res = await request.delete(`/legalEntities/${randomMongoId}`).set({ Authorization: adminToken });
        const errorMessage = res.body.error;

        expect(res.statusCode).toBe(404);
        expect(errorMessage).toBe('Юридическое лицо не существует в базе.');
      });

      test('указав корректный id, но имеется связь, должен возвращать statusCode 409 и сообщение об ошибке', async () => {
        const res = await request
          .delete(`/legalEntities/${entityIdRelatedToLocation}`)
          .set({ Authorization: adminToken });
        const errorMessage = res.body.error;

        expect(res.statusCode).toBe(409);
        expect(errorMessage).toBe('Юр лицо привязано к локациям! Удаление запрещено.');
      });

      test('указав корректный id сущности без связей, должен возвращать statusCode 200 и объект с информацию об удалении со свойством deletedCoutn = 1', async () => {
        const res = await request
          .delete(`/legalEntities/${entityIdNotRelatedToLocation}`)
          .set({ Authorization: adminToken });
        const result = res.body;

        expect(res.statusCode).toBe(200);
        expect(result.deletedCount).toBe(1);
      });
    });
  });

  describe('PUT /legalEntities/:id', () => {
    test('неавторизованный пользователь пытается редактировать 1 запись, должен возвращать statusCode 401 и сообщение об ошибке', async () => {
      const res = await request
        .put(`/legalEntities/${entityIdNotRelatedToLocation}`)
        .send({ name: 'Updated name by anonymous' });
      const errorMessage = res.body.error;

      expect(res.statusCode).toBe(401);
      expect(errorMessage).toBe('Отсутствует токен авторизации.');
    });

    test('пользователь с рандомным токеном пытается редактировать 1 запись, должен возвращать statusCode 401 и сообщение об ошибке', async () => {
      const res = await request
        .put(`/legalEntities/${entityIdNotRelatedToLocation}`)
        .set({ Authorization: 'some-random-token' })
        .send({ name: 'Updated name by anonymous with random token' });
      const errorMessage = res.body.error;

      expect(res.statusCode).toBe(401);
      expect(errorMessage).toBe('Предоставлен неверный токен авторизации.');
    });

    test('пользователь с ролью "user" пытается редактировать 1 запись, должен возвращать statusCode 403 и сообщение о недостаточных правах', async () => {
      const res = await request
        .put(`/legalEntities/${entityIdNotRelatedToLocation}`)
        .set({ Authorization: userToken })
        .send({ name: 'Updated name by user' });
      const errorMessage = res.body.error;

      expect(res.statusCode).toBe(403);
      expect(errorMessage).toBe('Неавторизованный пользователь. Нет прав на совершение действия.');
    });

    describe('пользоваетель с ролью "admin" пытается редактировать 1 запись', () => {
      test('указав некорректный mongodb id, должен возвращать statusCode 422 и сообщение об ошибке', async () => {
        const res = await request
          .put(`/legalEntities/random-string`)
          .set({ Authorization: adminToken })
          .send({ name: 'Updated name by admin' });
        const errorMessage = res.body.error;

        expect(res.statusCode).toBe(422);
        expect(errorMessage).toBe('Некорректный id юридического лица.');
      });

      test('указав корректный, но несуществующий в базе id, должен возвращать statusCode 404 и сообщение об ошибке', async () => {
        const randomMongoId = new mongoose.Types.ObjectId().toString();
        const res = await request
          .put(`/legalEntities/${randomMongoId}`)
          .set({ Authorization: adminToken })
          .send({ name: 'Updated name by admin' });
        const errorMessage = res.body.error;

        expect(res.statusCode).toBe(404);
        expect(errorMessage).toBe('Юридическое лицо не существует в базе.');
      });

      test('указав корректный id и валидные данные, должен возвращать statusCode 200 и объект измененной записи', async () => {
        const updateDto = { name: 'Updated name by admin' };
        const res = await request
          .put(`/legalEntities/${entityIdNotRelatedToLocation}`)
          .set({ Authorization: adminToken })
          .send(updateDto);
        const updatedEntity = res.body;

        expect(res.statusCode).toBe(200);
        expect(updatedEntity._id).toBe(entityIdNotRelatedToLocation);
        expect(updatedEntity.name).toBe(updateDto.name);
      });

      test('указав корректный id и невалидные данные, должен возвращать statusCode 422 и объект ValidationError', async () => {
        const res = await request
          .put(`/legalEntities/${entityIdNotRelatedToLocation}`)
          .set({ Authorization: adminToken })
          .send({ name: [] });
        const validationError = res.body;

        expect(res.statusCode).toBe(422);
        expect(validationError.name).toBe('ValidationError');
        expect(validationError.errors.name).not.toBeUndefined();
      });
    });
  });
});

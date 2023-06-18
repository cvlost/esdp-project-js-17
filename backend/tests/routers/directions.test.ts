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
import directionRouter from '../../routers/directions';

app.use('/directions', directionRouter);
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
const createDirectionDto = { name: 'new test direction' };

describe('directionRouter', () => {
  let directionIdNotRelatedToLocation: string;
  let directionIdRelatedToLocation: string;
  beforeAll(async () => {
    await db.connect();
  });
  beforeEach(async () => {
    await db.clear();
    await User.create(adminDto, userDto);
    const [notRelatedDirection, relatedDirection] = await Direction.create({ name: 'south' }, { name: 'west' });
    const area = await Area.create({ name: 'area' });
    const city = await City.create({ name: 'city', area: area._id });
    const region = await Region.create({ name: 'region', city: city._id });
    const [street1, street2] = await Street.create(
      { name: 'street1', city: city._id },
      { name: 'street2', city: city._id },
    );
    directionIdNotRelatedToLocation = notRelatedDirection._id.toString();
    directionIdRelatedToLocation = relatedDirection._id.toString();
    await Location.create({
      legalEntity: (await LegalEntity.create({ name: 'legal entity' }))._id,
      format: (await Format.create({ name: 'direction' }))._id,
      direction: relatedDirection._id,
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

  describe('GET /directions', () => {
    test('неавторизованный пользователь пытается получить список, должен созвращать statusCode 401 и сообщение об ошибке', async () => {
      const res = await request.get(`/directions`);
      const errorMessage = res.body.error;
      expect(res.statusCode).toBe(401);
      expect(errorMessage).toBe('Отсутствует токен авторизации.');
    });

    test('пользователь с рандомным токеном пытается получить список, должен созвращать statusCode 401 и сообщение об ошибке', async () => {
      const res = await request.get(`/directions`).set({ Authorization: 'random-token' });
      const errorMessage = res.body.error;
      expect(res.statusCode).toBe(401);
      expect(errorMessage).toBe('Предоставлен неверный токен авторизации.');
    });
    test('пользователь с ролью "user" пытается получить список, должен созвращать statusCode 200 и список элементов длиной 1', async () => {
      await Direction.deleteMany();
      await Direction.create(createDirectionDto);
      const res = await request.get(`/directions`).set({ Authorization: userToken });
      const directionsList = res.body;
      expect(res.statusCode).toBe(200);
      expect(Array.isArray(directionsList)).toBe(true);
      expect(directionsList.length).toBe(1);
    });
    test('пользователь с ролью "admin" пытается получить список, должен созвращать statusCode 200 и список элементов длиной 1', async () => {
      await Direction.deleteMany();
      await Direction.create(createDirectionDto);
      const res = await request.get(`/directions`).set({ Authorization: adminToken });
      const directionsList = res.body;
      expect(res.statusCode).toBe(200);
      expect(Array.isArray(directionsList)).toBe(true);
      expect(directionsList.length).toBe(1);
    });
    test('элементы списка должны иметь свойства _id и name', async () => {
      await Direction.deleteMany();
      const createdDirection = await Direction.create(createDirectionDto);
      const res = await request.get(`/directions`).set({ Authorization: adminToken });
      const directions = res.body;
      const direction = directions[0];
      expect(res.statusCode).toBe(200);
      expect(directions.length).toBe(1);
      expect(direction._id).not.toBeUndefined();
      expect(direction._id).toBe(createdDirection._id.toString());
      expect(direction.name).not.toBeUndefined();
      expect(direction.name).toBe(createDirectionDto.name);
    });
  });

  describe('POST /directions', () => {
    test('неавторизованный пользователь пытается создать новую запись, должен возвращать statusCode 401 и сообщение об ошибке', async () => {
      const res = await request.post('/directions').send(createDirectionDto);
      const errorMessage = res.body.error;
      expect(res.statusCode).toBe(401);
      expect(errorMessage).toBe('Отсутствует токен авторизации.');
    });
    test('пользователь с рандомным токеном пытается создать новую запись, должен возвращать statusCode 401 и сообщение об ошибке', async () => {
      const res = await request
        .post('/directions')
        .set({ Authorization: 'some-random-token' })
        .send(createDirectionDto);
      const errorMessage = res.body.error;
      expect(res.statusCode).toBe(401);
      expect(errorMessage).toBe('Предоставлен неверный токен авторизации.');
    });
    test('пользователь с ролью "user" пытается создать новую запись, должен возвращать statusCode 403 и сообщение об ошибке', async () => {
      const res = await request.post('/directions').set({ Authorization: userToken }).send(createDirectionDto);
      const error = res.body.error;
      expect(res.statusCode).toBe(403);
      expect(error).toBe('Неавторизованный пользователь. Нет прав на совершение действия.');
    });

    describe('пользователь с ролью "admin" пытается создать новую запись', () => {
      test('с дублирующимися данными, должен возвращать statusCode 422 и сообщение об ошибке', async () => {
        const duplicateDto = { name: 'duplicate name' };
        await Direction.create(duplicateDto);
        const res = await request.post('/directions').send(duplicateDto).set({ Authorization: adminToken });
        const validationError = res.body;
        expect(res.statusCode).toBe(422);
        expect(validationError.name).toBe('ValidationError');
        expect(validationError.errors.name).not.toBeUndefined();
      });
      test('с некорректными данными, должен возвращать statusCode 422 и сообщение об ошибке', async () => {
        const res = await request.post('/directions').send({ bla: 'bla' }).set({ Authorization: adminToken });
        const name = res.body.name;
        expect(res.statusCode).toBe(422);
        expect(name).toBe('ValidationError');
      });
      test('с корректными данными, дожен возвращать statusCode 201 и объект с сообщением и созданной записью', async () => {
        await Direction.deleteMany();
        const res = await request.post('/directions').send(createDirectionDto).set({ Authorization: adminToken });
        const { message, direction } = res.body;
        expect(res.statusCode).toBe(201);
        expect(message).toBe('Новое направление успешно создано!');
        expect(direction._id).not.toBeUndefined();
        expect(typeof direction._id === 'string').toBe(true);
        expect(direction.name).not.toBeUndefined();
        expect(direction.name).toBe(createDirectionDto.name);
      });
    });
  });

  describe('DELETE /directions/:id', () => {
    test('неавторизованный пользователь пытается удалить 1 запись, должен возвращать statusCode 401 и сообщение об ошибке', async () => {
      const res = await request.delete(`/directions/${directionIdNotRelatedToLocation}`);
      const errorMessage = res.body.error;
      expect(res.statusCode).toBe(401);
      expect(errorMessage).toBe('Отсутствует токен авторизации.');
    });
    test('пользователь с рандомным токеном пытается удалить 1 запись, должен возвращать statusCode 401 и сообщение об ошибке', async () => {
      const res = await request
        .delete(`/directions/${directionIdNotRelatedToLocation}`)
        .set({ Authorization: 'some-random-token' });
      const errorMessage = res.body.error;
      expect(res.statusCode).toBe(401);
      expect(errorMessage).toBe('Предоставлен неверный токен авторизации.');
    });
    test('пользователь с ролью "user" пытается удалить 1 запись, должен возвращать statusCode 403 и сообщение о недостаточных правах', async () => {
      const res = await request
        .delete(`/directions/${directionIdNotRelatedToLocation}`)
        .set({ Authorization: userToken });
      const errorMessage = res.body.error;
      expect(res.statusCode).toBe(403);
      expect(errorMessage).toBe('Неавторизованный пользователь. Нет прав на совершение действия.');
    });

    describe('пользоваетель с ролью "admin" пытается удалить 1 запись', () => {
      test('указав некорректный mongodb id, должен возвращать statusCode 422 и сообщение об ошибке', async () => {
        const res = await request.delete(`/directions/random-string`).set({ Authorization: adminToken });
        const errorMessage = res.body.error;
        expect(res.statusCode).toBe(422);
        expect(errorMessage).toBe('Некорректный id направления.');
      });
      test('указав корректный, но несуществующий в базе id, должен возвращать statusCode 404 и сообщение об ошибке', async () => {
        const randomMongoId = new mongoose.Types.ObjectId().toString();
        const res = await request.delete(`/directions/${randomMongoId}`).set({ Authorization: adminToken });
        const errorMessage = res.body.error;
        expect(res.statusCode).toBe(404);
        expect(errorMessage).toBe('Направление не существует в базе.');
      });
      test('указав корректный id, но имеется связь, должен возвращать statusCode 409 и сообщение об ошибке', async () => {
        const res = await request
          .delete(`/directions/${directionIdRelatedToLocation}`)
          .set({ Authorization: adminToken });
        const errorMessage = res.body.error;
        expect(res.statusCode).toBe(409);
        expect(errorMessage).toBe('Направление привязано к локациям! Удаление запрещено.');
      });
      test('указав корректный id сущности без связей, должен возвращать statusCode 200 и объект с информацию об удалении со свойством deletedCount = 1', async () => {
        const res = await request
          .delete(`/directions/${directionIdNotRelatedToLocation}`)
          .set({ Authorization: adminToken });
        const result = res.body;
        expect(res.statusCode).toBe(200);
        expect(result.deletedCount).toBe(1);
      });
    });
  });
});

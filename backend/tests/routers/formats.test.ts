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
import formatRouter from '../../routers/formats';

app.use('/formats', formatRouter);
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
const createFormatDto = { name: 'new test format' };

describe('formatRouter', () => {
  let formatIdNotRelatedToLocation: string;
  let formatIdRelatedToLocation: string;
  beforeAll(async () => {
    await db.connect();
  });
  beforeEach(async () => {
    await db.clear();
    await User.create(adminDto, userDto);
    const [notRelatedFormat, relatedFormat] = await Format.create({ name: 'z-format' }, { name: 'y-format' });
    const area = await Area.create({ name: 'area' });
    const city = await City.create({ name: 'city', area: area._id });
    const region = await Region.create({ name: 'region', city: city._id });
    const [street1, street2] = await Street.create(
      { name: 'street1', city: city._id },
      { name: 'street2', city: city._id },
    );
    formatIdNotRelatedToLocation = notRelatedFormat._id.toString();
    formatIdRelatedToLocation = relatedFormat._id.toString();
    await Location.create({
      legalEntity: (await LegalEntity.create({ name: 'legal entity' }))._id,
      format: relatedFormat._id,
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

  describe('GET /formats', () => {
    test('неавторизованный пользователь пытается получить список, должен созвращать statusCode 401 и сообщение об ошибке', async () => {
      const res = await request.get(`/formats`);
      const errorMessage = res.body.error;
      expect(res.statusCode).toBe(401);
      expect(errorMessage).toBe('Отсутствует токен авторизации.');
    });
    test('пользователь с рандомным токеном пытается получить список, должен созвращать statusCode 401 и сообщение об ошибке', async () => {
      const res = await request.get(`/formats`).set({ Authorization: 'random-token' });
      const errorMessage = res.body.error;
      expect(res.statusCode).toBe(401);
      expect(errorMessage).toBe('Предоставлен неверный токен авторизации.');
    });
    test('пользователь с ролью "user" пытается получить список, должен созвращать statusCode 200 и список элементов длиной 1', async () => {
      await Format.deleteMany();
      await Format.create(createFormatDto);
      const res = await request.get(`/formats`).set({ Authorization: userToken });
      const formatsList = res.body;
      expect(res.statusCode).toBe(200);
      expect(Array.isArray(formatsList)).toBe(true);
      expect(formatsList.length).toBe(1);
    });
    test('пользователь с ролью "admin" пытается получить список, должен созвращать statusCode 200 и список элементов длиной 1', async () => {
      await Format.deleteMany();
      await Format.create(createFormatDto);
      const res = await request.get(`/formats`).set({ Authorization: adminToken });
      const formatsList = res.body;
      expect(res.statusCode).toBe(200);
      expect(Array.isArray(formatsList)).toBe(true);
      expect(formatsList.length).toBe(1);
    });
    test('элементы списка должны иметь свойства _id и name', async () => {
      await Format.deleteMany();
      const createdFormat = await Format.create(createFormatDto);
      const res = await request.get(`/formats`).set({ Authorization: adminToken });
      const formatsList = res.body;
      const format = formatsList[0];
      expect(res.statusCode).toBe(200);
      expect(formatsList.length).toBe(1);
      expect(format._id).not.toBeUndefined();
      expect(format._id).toBe(createdFormat._id.toString());
      expect(format.name).not.toBeUndefined();
      expect(format.name).toBe(createFormatDto.name);
    });
  });

  describe('POST /formats', () => {
    test('неавторизованный пользователь пытается создать новую запись, должен возвращать statusCode 401 и сообщение об ошибке', async () => {
      const res = await request.post('/formats').send(createFormatDto);
      const errorMessage = res.body.error;
      expect(res.statusCode).toBe(401);
      expect(errorMessage).toBe('Отсутствует токен авторизации.');
    });
    test('пользователь с рандомным токеном пытается создать новую запись, должен возвращать statusCode 401 и сообщение об ошибке', async () => {
      const res = await request.post('/formats').set({ Authorization: 'some-random-token' }).send(createFormatDto);
      const errorMessage = res.body.error;
      expect(res.statusCode).toBe(401);
      expect(errorMessage).toBe('Предоставлен неверный токен авторизации.');
    });
    test('пользователь с ролью "user" пытается создать новую запись, должен возвращать statusCode 403 и сообщение об ошибке', async () => {
      const res = await request.post('/formats').set({ Authorization: userToken }).send(createFormatDto);
      const error = res.body.error;
      expect(res.statusCode).toBe(403);
      expect(error).toBe('Неавторизованный пользователь. Нет прав на совершение действия.');
    });

    describe('пользователь с ролью "admin" пытается создать новую запись', () => {
      test('с дублирующимися данными, должен возвращать statusCode 422 и сообщение об ошибке', async () => {
        const duplicateDto = { name: 'duplicate name' };
        await Format.create(duplicateDto);
        const res = await request.post('/formats').send(duplicateDto).set({ Authorization: adminToken });
        const validationError = res.body;
        expect(res.statusCode).toBe(422);
        expect(validationError.name).toBe('ValidationError');
        expect(validationError.errors.name).not.toBeUndefined();
      });
      test('с некорректными данными, должен возвращать statusCode 422 и сообщение об ошибке', async () => {
        const res = await request.post('/formats').send({ bla: 'bla' }).set({ Authorization: adminToken });
        const name = res.body.name;
        expect(res.statusCode).toBe(422);
        expect(name).toBe('ValidationError');
      });
      test('с корректными данными, дожен возвращать statusCode 201 и объект с сообщением и созданной записью', async () => {
        await Format.deleteMany();
        const res = await request.post('/formats').send(createFormatDto).set({ Authorization: adminToken });
        const { message, format } = res.body;
        expect(res.statusCode).toBe(201);
        expect(message).toBe('Новый формат успешно создан!');
        expect(format._id).not.toBeUndefined();
        expect(typeof format._id === 'string').toBe(true);
        expect(format.name).not.toBeUndefined();
        expect(format.name).toBe(createFormatDto.name);
      });
    });
  });

  describe('DELETE /formats/:id', () => {
    test('неавторизованный пользователь пытается удалить 1 запись, должен возвращать statusCode 401 и сообщение об ошибке', async () => {
      const res = await request.delete(`/formats/${formatIdNotRelatedToLocation}`);
      const errorMessage = res.body.error;
      expect(res.statusCode).toBe(401);
      expect(errorMessage).toBe('Отсутствует токен авторизации.');
    });
    test('пользователь с рандомным токеном пытается удалить 1 запись, должен возвращать statusCode 401 и сообщение об ошибке', async () => {
      const res = await request
        .delete(`/formats/${formatIdNotRelatedToLocation}`)
        .set({ Authorization: 'some-random-token' });
      const errorMessage = res.body.error;
      expect(res.statusCode).toBe(401);
      expect(errorMessage).toBe('Предоставлен неверный токен авторизации.');
    });
    test('пользователь с ролью "user" пытается удалить 1 запись, должен возвращать statusCode 403 и сообщение о недостаточных правах', async () => {
      const res = await request.delete(`/formats/${formatIdNotRelatedToLocation}`).set({ Authorization: userToken });
      const errorMessage = res.body.error;
      expect(res.statusCode).toBe(403);
      expect(errorMessage).toBe('Неавторизованный пользователь. Нет прав на совершение действия.');
    });

    describe('пользоваетель с ролью "admin" пытается удалить 1 запись', () => {
      test('указав некорректный mongodb id, должен возвращать statusCode 422 и сообщение об ошибке', async () => {
        const res = await request.delete(`/formats/random-string`).set({ Authorization: adminToken });
        const errorMessage = res.body.error;
        expect(res.statusCode).toBe(422);
        expect(errorMessage).toBe('Некорректный id формата.');
      });
      test('указав корректный, но несуществующий в базе id, должен возвращать statusCode 404 и сообщение об ошибке', async () => {
        const randomMongoId = new mongoose.Types.ObjectId().toString();
        const res = await request.delete(`/formats/${randomMongoId}`).set({ Authorization: adminToken });
        const errorMessage = res.body.error;
        expect(res.statusCode).toBe(404);
        expect(errorMessage).toBe('Формат не существует в базе.');
      });
      test('указав корректный id, но имеется связь, должен возвращать statusCode 409 и сообщение об ошибке', async () => {
        const res = await request.delete(`/formats/${formatIdRelatedToLocation}`).set({ Authorization: adminToken });
        const errorMessage = res.body.error;
        expect(res.statusCode).toBe(409);
        expect(errorMessage).toBe('Формат привязан к локациям! Удаление запрещено.');
      });
      test('указав корректный id сущности без связей, должен возвращать statusCode 200 и объект с информацию об удалении со свойством deletedCount = 1', async () => {
        const res = await request.delete(`/formats/${formatIdNotRelatedToLocation}`).set({ Authorization: adminToken });
        const result = res.body;
        expect(res.statusCode).toBe(200);
        expect(result.deletedCount).toBe(1);
      });
    });
  });
});

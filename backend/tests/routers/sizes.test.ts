import app from '../app';
import sizesRouter from '../../routers/sizes';
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

app.use('/sizes', sizesRouter);
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

describe('sizesRouter', () => {
  let sizeIdNotRelatedToLocation: string;
  let sizeIdRelatedToLocation: string;

  beforeAll(async () => {
    await db.connect();
  });

  beforeEach(async () => {
    await db.clear();
    await User.create(adminDto, userDto);
    const [notRelatedSize, relatedSize] = await Size.create({ name: '1000x4000' }, { name: '23x32' });
    const area = await Area.create({ name: 'area' });
    const city = await City.create({ name: 'city', area: area._id });
    const region = await Region.create({ name: 'region', city: city._id });
    const [street1, street2] = await Street.create(
      { name: 'street1', city: city._id },
      { name: 'street2', city: city._id },
    );
    sizeIdNotRelatedToLocation = notRelatedSize._id.toString();
    sizeIdRelatedToLocation = relatedSize._id.toString();
    await Location.create({
      legalEntity: (await LegalEntity.create({ name: 'legalEntity' }))._id,
      format: (await Format.create({ name: 'format' }))._id,
      direction: (await Direction.create({ name: 'direction' }))._id,
      lighting: (await Lighting.create({ name: 'lighting' }))._id,
      region: region._id,
      size: relatedSize._id,
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

  describe('GET /sizes', () => {
    test('если неавторизованный пользователь пытается получить список размеров, должен возвращаться statusCode 401 и объект с сообщением об ошибке', async () => {
      const res = await request.get('/sizes');
      const errorMessage = res.body.error;

      expect(res.statusCode).toBe(401);
      expect(errorMessage).toBe('Отсутствует токен авторизации.');
    });

    test('если пользователь с рандомным токеном пытается получить список размеров, должен возвращаться statusCode 401 и объект с сообщением об ошибке', async () => {
      const res = await request.get('/sizes').set({ Authorization: 'random-token' });
      const errorMessage = res.body.error;

      expect(res.statusCode).toBe(401);
      expect(errorMessage).toBe('Предоставлен неверный токен авторизации.');
    });

    test('если пользователь с ролью "user" пытается получить список размеров, должен возвращаться statusCode 200 и массив размеров длинной 1', async () => {
      await Size.deleteMany();
      const sizeDto = { name: '3x5' };
      await Size.create(sizeDto);
      const res = await request.get('/sizes').set({ Authorization: userToken });
      const sizesList = res.body;

      expect(res.statusCode).toBe(200);
      expect(Array.isArray(sizesList)).toBe(true);
      expect(sizesList.length).toBe(1);
    });

    test('если пользователь с ролью "admin" пытается получить список размеров, должен возвращаться statusCode 200 и массив размеров длинной 1', async () => {
      await Size.deleteMany();
      const sizeDto = { name: '3x5' };
      await Size.create(sizeDto);
      const res = await request.get('/sizes').set({ Authorization: adminToken });
      const sizesList = res.body;

      expect(res.statusCode).toBe(200);
      expect(Array.isArray(sizesList)).toBe(true);
      expect(sizesList.length).toBe(1);
    });

    test('элементы списка должны содержать 2 поля "_id" и "name"', async () => {
      await Size.deleteMany();
      const sizeDto = { name: '3x5' };
      const createdSize = await Size.create(sizeDto);
      const res = await request.get('/sizes').set({ Authorization: adminToken });
      const sizesList = res.body;
      const size = sizesList[0];

      expect(res.statusCode).toBe(200);
      expect(sizesList.length).toBe(1);
      expect(size._id).not.toBeUndefined();
      expect(size._id).toBe(createdSize._id.toString());
      expect(size.name).not.toBeUndefined();
      expect(size.name).toBe(sizeDto.name);
    });
  });

  describe('POST /sizes', () => {
    test('если неавторизованный пользователь пытается создать новый размер, то должен возвращаться statusCode 401 и объект с сообщением об ошибке', async () => {
      const createSizeDto = { name: '500x500' };
      const res = await request.post('/sizes').send(createSizeDto);
      const errorMessage = res.body.error;

      expect(res.statusCode).toBe(401);
      expect(errorMessage).toBe('Отсутствует токен авторизации.');
    });
    test('если пользователь с рандомным токеном пытается создать новый размер, то должен возвращаться statusCode 401 и объект с сообщением об ошибке', async () => {
      const createSizeDto = { name: '500x500' };
      const res = await request.post('/sizes').send(createSizeDto).set({ Authorization: 'random-token' });
      const errorMessage = res.body.error;

      expect(res.statusCode).toBe(401);
      expect(errorMessage).toBe('Предоставлен неверный токен авторизации.');
    });
    test('если пользователь с ролью "user" пытается создать новый размер, то должен возвращаться statusCode 403 и сообщение ошибки о недостаточных правах на действие', async () => {
      const createSizeDto = { name: '500x500' };
      const res = await request.post('/sizes').send(createSizeDto).set({ Authorization: userToken });
      const errorMessage = res.body.error;

      expect(res.statusCode).toBe(403);
      expect(errorMessage).toBe('Неавторизованный пользователь. Нет прав на совершение действия.');
    });
    describe('если пользователь с ролью "admin" пытается создать новый размер', () => {
      test('с верными данными, должен возвращаться statusCode 201 и объект с сообщением и созданным размером', async () => {
        const createSizeDto = { name: '500x500' };
        const res = await request.post('/sizes').send(createSizeDto).set({ Authorization: adminToken });
        const { message, size } = res.body;

        expect(res.statusCode).toBe(201);
        expect(message).toBe('Новый размер успешно создан!');
        expect(size._id).not.toBeUndefined();
        expect(typeof size._id === 'string').toBe(true);
        expect(size.name).not.toBeUndefined();
        expect(size.name).toBe(createSizeDto.name);
      });

      test('c невернымы данными, то должен возвращаться statusCode 422 и обект ValidationError', async () => {
        const res = await request.post('/sizes').send({ bla: 'bla' }).set({ Authorization: adminToken });
        const name = res.body.name;

        expect(res.statusCode).toBe(422);
        expect(name).toBe('ValidationError');
      });

      test('с дублирующимся размером, должен возвращать statusCode 422 и обект ValidationError с сообщением о дублировании', async () => {
        const duplicateDto = { name: '500x500' };
        await Size.create(duplicateDto);
        const res = await request.post('/sizes').send(duplicateDto).set({ Authorization: adminToken });
        const validationError = res.body;

        expect(res.statusCode).toBe(422);
        expect(validationError.name).toBe('ValidationError');
        expect(validationError.errors.name).not.toBeUndefined();
      });
    });
  });

  describe('DELETE /sizes/:id', () => {
    test('неавторизованный пользователь пытается удалить, дожен возвращать statusCode 401 и сообщение об ошибке', async () => {
      const res = await request.delete(`/sizes/some-random-string-id`);
      const errorMessage = res.body.error;

      expect(res.statusCode).toBe(401);
      expect(errorMessage).toBe('Отсутствует токен авторизации.');
    });

    test('пользователь с рандомным токеном пытается удалить, должен возвращать statusCode 401 и сообщение об ошибке', async () => {
      const res = await request
        .delete(`/sizes/${sizeIdNotRelatedToLocation}`)
        .set({ Authorization: 'some-random-token' });
      const errorMessage = res.body.error;

      expect(res.statusCode).toBe(401);
      expect(errorMessage).toBe('Предоставлен неверный токен авторизации.');
    });

    test('пользователь с ролью "user" пытается удалить, должен возвращать statusCode 403 и сообщение о недостаточных правах', async () => {
      const res = await request.delete(`/sizes/${sizeIdNotRelatedToLocation}`).set({ Authorization: userToken });
      const errorMessage = res.body.error;

      expect(res.statusCode).toBe(403);
      expect(errorMessage).toBe('Неавторизованный пользователь. Нет прав на совершение действия.');
    });

    describe('пользователь с ролью "admin" пытается удалить', () => {
      test('указав некорректный по форме mongodb id, должен возвращать statusCode 422 и сообщение об ошибке', async () => {
        const res = await request.delete(`/sizes/random-string`).set({ Authorization: adminToken });
        const errorMessage = res.body.error;

        expect(res.statusCode).toBe(422);
        expect(errorMessage).toBe('Некорректный id размера.');
      });

      test('указав корректный, но не существующий в базе id, должен возвращать statusCode 404 и сообщение об ошибке', async () => {
        const randomMongoId = new mongoose.Types.ObjectId().toString();
        const res = await request.delete(`/sizes/${randomMongoId}`).set({ Authorization: adminToken });
        const errorMessage = res.body.error;

        expect(res.statusCode).toBe(404);
        expect(errorMessage).toBe('Данный размер не существует в базе.');
      });

      test('указав корректный, но связанный с локациями id, должен возвращать statusCode 409 и сообщение об ошибке', async () => {
        const res = await request.delete(`/sizes/${sizeIdRelatedToLocation}`).set({ Authorization: adminToken });
        const errorMessage = res.body.error;

        expect(res.statusCode).toBe(409);
        expect(errorMessage).toBe('Данный размер привязан к локациям! Удаление запрещено.');
      });

      test('указав корректный id, должен возвращать statusCode 200 и объект с информацией об удалении с полем deleteCount = 1', async () => {
        const res = await request.delete(`/sizes/${sizeIdNotRelatedToLocation}`).set({ Authorization: adminToken });
        const result = res.body;

        expect(res.statusCode).toBe(200);
        expect(result.deletedCount).toBe(1);
      });
    });
  });
});

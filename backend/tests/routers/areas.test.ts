import supertest from 'supertest';
import * as db from '../db';
import app from '../app';
import areasRouter from '../../routers/areas';
import { randomUUID } from 'crypto';
import User from '../../models/Users';
import Area from '../../models/Area';
import City from '../../models/City';
import mongoose from 'mongoose';

app.use('/areas', areasRouter);
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
const area1Dto = { name: 'Чуйская' };
const createAreaDto = { name: 'New area' };

describe('areasRouter', () => {
  let area1Id: string;
  beforeAll(async () => {
    await db.connect();
  });
  beforeEach(async () => {
    await db.clear();
    await User.create(adminDto, userDto);
    const area1 = await Area.create(area1Dto);
    await City.create({ name: 'Бишкек', area: area1._id });
    area1Id = area1._id.toString();
  });
  afterEach(async () => {
    await db.clear();
  });
  afterAll(async () => {
    await db.disconnect();
  });

  describe('GET /areas', () => {
    test('если неавторизованный пользователь пытается получить список областей, должен возвращаться statusCode 401 и объект с сообщением об ошибке', async () => {
      const res = await request.get('/areas');
      const errorMessage = res.body.error;
      expect(res.statusCode).toBe(401);
      expect(errorMessage).toBe('Отсутствует токен авторизации.');
    });
    test('если пользователь c рандомным токеном пытается получить список областей, должен возвращаться statusCode 401 и объект с сообщением об ошибке', async () => {
      const res = await request.get('/areas').set({ Authorization: 'some-random-token' });
      const errorMessage = res.body.error;
      expect(res.statusCode).toBe(401);
      expect(errorMessage).toBe('Предоставлен неверный токен авторизации.');
    });
    test('если пользователь с ролью "admin" пытается получить список областей, должен возвращаться statusCode 200 и массив областей длинной 1', async () => {
      const res = await request.get('/areas').set({ Authorization: adminToken });
      const areasList = res.body;
      expect(res.statusCode).toBe(200);
      expect(Array.isArray(areasList)).toBe(true);
      expect(areasList.length).toBe(1);
    });
    test('если пользователь с ролью "user" пытается получитьс список областей, то должен возвращаться statusCode 200 и массив областей длинной 1', async () => {
      const res = await request.get('/areas').set({ Authorization: userToken });
      const areasList = res.body;
      expect(res.statusCode).toBe(200);
      expect(Array.isArray(areasList)).toBe(true);
      expect(areasList.length).toBe(1);
    });
    test('элементы списка должны содержать 2 поля "_id" и "name"', async () => {
      const res = await request.get('/areas').set({ Authorization: adminToken });
      const areasList = res.body;
      const area = areasList[0];
      expect(res.statusCode).toBe(200);
      expect(areasList.length).toBe(1);
      expect(area._id).not.toBeUndefined();
      expect(area._id).toBe(area1Id);
      expect(area.name).not.toBeUndefined();
      expect(area.name).toBe(area1Dto.name);
    });
  });

  describe('POST /areas', () => {
    test('если неавторизованный пользователь пытается создать новую область, то должен возвращаться statusCode 401 и объект с сообщением об ошибке', async () => {
      const res = await request.post('/areas').send(createAreaDto);
      const errorMessage = res.body.error;
      expect(res.statusCode).toBe(401);
      expect(errorMessage).toBe('Отсутствует токен авторизации.');
    });

    test('если пользователь c рандомным токеном пытается создать новую область, должен возвращаться statusCode 401 и объект с сообщением об ошибке', async () => {
      const res = await request.post('/areas').set({ Authorization: 'some-random-token' }).send(createAreaDto);
      const errorMessage = res.body.error;
      expect(res.statusCode).toBe(401);
      expect(errorMessage).toBe('Предоставлен неверный токен авторизации.');
    });

    test('если пользователь с ролью "user" пытается создать новую область, то должен возвращаться statusCode 403 и сообщение ошибки о недостаточных правах на действие', async () => {
      const res = await request.post('/areas').set({ Authorization: userToken }).send(createAreaDto);
      const error = res.body.error;
      expect(res.statusCode).toBe(403);
      expect(error).toBe('Неавторизованный пользователь. Нет прав на совершение действия.');
    });
    describe('если пользователь с ролью "admin" пытается создать новую область', () => {
      test('с верными данными, должен возвращаться statusCode 201 и объект с сообщением и созданной областью', async () => {
        const res = await request.post('/areas').set({ Authorization: adminToken }).send(createAreaDto);
        const { message, area } = res.body;
        expect(res.statusCode).toBe(201);
        expect(message).toBe('Новая область успешно создана!');
        expect(area._id).not.toBeUndefined();
        expect(area.name).not.toBeUndefined();
        expect(area.name).toBe(createAreaDto.name);
      });
      test('с дублирующимся названием, должен возвращать statusCode 422 и обект ValidationError с сообщением о дублировании', async () => {
        const duplicateDto = { name: 'area duplicate' };
        await Area.create(duplicateDto);
        const res = await request.post('/areas').send(duplicateDto).set({ Authorization: adminToken });
        const validationError = res.body;
        expect(res.statusCode).toBe(422);
        expect(validationError.name).toBe('ValidationError');
        expect(validationError.errors.name).not.toBeUndefined();
      });
      test('c невернымы данными, то должен возвращаться statusCode 422 и обект ValidationError', async () => {
        const res = await request.post('/areas').set({ Authorization: adminToken }).send({ bla: 'bla' });
        const name = res.body.name;
        expect(res.statusCode).toBe(422);
        expect(name).toBe('ValidationError');
      });
    });
  });

  describe('DELETE /areas/:id', () => {
    test('если неавторизованный пользователь пытается удалить область по id, должен возваращаться statusCode 401 и сообщение об ошибке', async () => {
      const res = await request.delete(`/areas/${area1Id}`);
      const errorMessage = res.body.error;
      expect(res.statusCode).toBe(401);
      expect(errorMessage).toBe('Отсутствует токен авторизации.');
    });
    test('если пользователь c рандомным токеном пытается удалить область по id, должен возвращаться statusCode 401 и объект с сообщением об ошибке', async () => {
      const res = await request.get('/areas').set({ Authorization: 'some-random-token' });
      const errorMessage = res.body.error;
      expect(res.statusCode).toBe(401);
      expect(errorMessage).toBe('Предоставлен неверный токен авторизации.');
    });
    test('если пользователь с ролью "user" пытается удалить область по id, должен возваращаться statusCode 403 и сообщение об ошибке', async () => {
      const res = await request.delete(`/areas/${area1Id}`).set({ Authorization: userToken });
      const errorMessage = res.body.error;
      expect(res.statusCode).toBe(403);
      expect(errorMessage).toBe('Неавторизованный пользователь. Нет прав на совершение действия.');
    });
    describe('если пользователь с ролью "admin" пытается удалить область', () => {
      test('с некорректным по форме mongodb id, должен возвращать statusCode 422 и сообщение об ошибке', async () => {
        const res = await request.delete(`/areas/some-random-string-id`).set({ Authorization: adminToken });
        const errorMessage = res.body.error;
        expect(res.statusCode).toBe(422);
        expect(errorMessage).toBe('Некорректный id области.');
      });
      test('с верным id, но со связанным городом, должен возвращать statusCode 409 и сообщение об ошибке', async () => {
        const res = await request.delete(`/areas/${area1Id}`).set({ Authorization: adminToken });
        const errorMessage = res.body.error;
        expect(res.statusCode).toBe(409);
        expect(errorMessage).toBe('Область привязана к другим сущностям! Удаление запрещено.');
      });
      test('с верным id и без всязанных сущностей, должен возвращать statusCode 200 и объект с информацией об удалении с полем deletedCount = 1', async () => {
        const area = await Area.create(createAreaDto);
        const res = await request.delete(`/areas/${area._id.toString()}`).set({ Authorization: adminToken });
        const result = res.body;
        expect(res.statusCode).toBe(200);
        expect(result.deletedCount).toBe(1);
      });
      test('с корректным, но отсутствующим в базе id, должен возвращать statusCode 404 и сообщение об ошибке', async () => {
        const res = await request
          .delete(`/areas/${new mongoose.Types.ObjectId().toString()}`)
          .set({ Authorization: adminToken });
        const errorMessage = res.body.error;
        expect(res.statusCode).toBe(404);
        expect(errorMessage).toBe('Область не существует в базе.');
      });
    });
  });

  describe('PUT /areas/:id', () => {
    test('неавторизованный пользователь пытается редактировать 1 запись, должен возвращать statusCode 401 и сообщение об ошибке', async () => {
      const res = await request.put(`/areas/${area1Id}`).send({ name: 'Updated name by anonymous' });
      const errorMessage = res.body.error;

      expect(res.statusCode).toBe(401);
      expect(errorMessage).toBe('Отсутствует токен авторизации.');
    });
    test('пользователь с рандомным токеном пытается редактировать 1 запись, должен возвращать statusCode 401 и сообщение об ошибке', async () => {
      const res = await request
        .put(`/areas/${area1Id}`)
        .set({ Authorization: 'some-random-token' })
        .send({ name: 'Updated name by anonymous with random token' });
      const errorMessage = res.body.error;

      expect(res.statusCode).toBe(401);
      expect(errorMessage).toBe('Предоставлен неверный токен авторизации.');
    });

    describe('авторизованный пользователь пытается редактировать 1 запись', () => {
      test('указав некорректный mongodb id, должен возвращать statusCode 422 и сообщение об ошибке', async () => {
        const res = await request
          .put(`/areas/random-string`)
          .set({ Authorization: adminToken })
          .send({ name: 'Updated name by admin' });
        const errorMessage = res.body.error;

        expect(res.statusCode).toBe(422);
        expect(errorMessage).toBe('Некорректный id области.');
      });
      test('указав корректный, но несуществующий в базе id, должен возвращать statusCode 404 и сообщение об ошибке', async () => {
        const randomMongoId = new mongoose.Types.ObjectId().toString();
        const res = await request
          .put(`/areas/${randomMongoId}`)
          .set({ Authorization: adminToken })
          .send({ name: 'Updated name by admin' });
        const errorMessage = res.body.error;
        expect(res.statusCode).toBe(404);
        expect(errorMessage).toBe('Область не существует в базе.');
      });
      test('указав корректный id и валидные данные, должен возвращать statusCode 200 и объект измененной записи', async () => {
        const updateDto = { name: 'updated area 1' };
        const res = await request.put(`/areas/${area1Id}`).set({ Authorization: adminToken }).send(updateDto);

        expect(res.statusCode).toBe(200);

        const updatedArea = await Area.findById(area1Id);
        expect(updatedArea).toBeTruthy();

        if (updatedArea) {
          expect(updatedArea.name).toBe(updateDto.name);
        }
      });
    });
  });
});

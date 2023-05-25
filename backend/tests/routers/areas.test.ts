import { describe } from '@jest/globals';
import supertest from 'supertest';
import * as db from '../db';
import app from '../app';
import areasRouter from '../../routers/areas';
import { randomUUID } from 'crypto';
import User from '../../models/Users';
import Area from '../../models/Area';
import City from '../../models/City';

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
  let createdAreaId: string;

  beforeAll(async () => {
    await db.connect();
    await User.create(adminDto, userDto);
    const area1 = await Area.create(area1Dto);
    await City.create({ name: 'Бишкек', area: area1._id });
    area1Id = area1._id.toString();
  });

  afterAll(async () => {
    await db.clear();
    await db.disconnect();
  });

  describe('GET /areas', () => {
    test('если обращается неавторизованный пользователь, то должен возвращаться statusCode 401 и объект с сообщением об ошибке', async () => {
      const res = await request.get('/areas');
      const errorMessage = res.body.error;

      expect(res.statusCode).toBe(401);
      expect(errorMessage).toBe('Отсутствует токен авторизации.');
    });

    test('если обращается пользователь с ролью "admin", то должен возвращаться statusCode 200 и массив областей длинной 1', async () => {
      const res = await request.get('/areas').set({ Authorization: adminToken });
      const areasList = res.body;

      expect(res.statusCode).toBe(200);
      expect(areasList.length).toBe(1);
    });

    test('если обращается пользователь с ролью "user", то должен возвращаться statusCode 200 и массив областей длинной 1', async () => {
      const res = await request.get('/areas').set({ Authorization: userToken });
      const areasList = res.body;

      expect(res.statusCode).toBe(200);
      expect(areasList.length).toBe(1);
    });

    test('элементы массива должны содержать 2 поля "_id" и "name"', async () => {
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

    test('если пользователь с ролью "user" пытается создать новую область, то должен возвращаться statusCode 403 и сообщение ошибки о недостаточных правах на действие', async () => {
      const res = await request.post('/areas').set({ Authorization: userToken }).send(createAreaDto);
      const error = res.body.error;

      expect(res.statusCode).toBe(403);
      expect(error).toEqual('Неавторизованный пользователь. Нет прав на совершение действия');
    });

    test('если пользователь с ролью "admin" пытается создать новую область, то должен созвращаться statusCode 201 и объект с сообщением и созданной областью', async () => {
      const res = await request.post('/areas').set({ Authorization: adminToken }).send(createAreaDto);
      const { message, area } = res.body;

      createdAreaId = area._id;

      expect(res.statusCode).toBe(201);
      expect(message).toBe('Новая область успешно создана!');
      expect(area._id).not.toBeUndefined();
      expect(area.name).not.toBeUndefined();
      expect(area.name).toBe(createAreaDto.name);
    });

    test('если пользователь с ролью "admin" пытается создать новую область c невернымы данными, то должен созвращаться statusCode 400 и обект ValidationError', async () => {
      const res = await request.post('/areas').set({ Authorization: adminToken }).send({ bla: 'bla' });
      const name = res.body.name;

      expect(res.statusCode).toBe(400);
      expect(name).toBe('ValidationError');
    });
  });

  describe('DELETE /areas/:id', () => {
    test('если неавторизованный пользователь пытается удалить область по id, должен возваращаться statusCode 401 и сообщение об ошибке', async () => {
      const res = await request.delete(`/areas/${area1Id}`);

      expect(res.statusCode).toBe(401);
    });

    test('если пользователь с ролью "user" пытается удалить область по id, должен возваращаться statusCode 403 и сообщение об ошибке', async () => {
      const res = await request.delete(`/areas/${area1Id}`).set({ Authorization: userToken });

      expect(res.statusCode).toBe(403);
    });

    describe('если пользователь с ролью "admin" пытается удалить область', () => {
      test('с некорректным по форме mongodb id, должен возвращать statusCode 400 и сообщение об ошибке', async () => {
        const res = await request.delete(`/areas/some-random-string-id`).set({ Authorization: adminToken });
        const errorMessage = res.body.error;

        expect(res.statusCode).toBe(400);
        expect(errorMessage).toBe('Некорректный id области');
      });

      test('с верным id, но со связанным городом, должен возвращать statusCode 409 и сообщение об ошибке', async () => {
        const res = await request.delete(`/areas/${area1Id}`).set({ Authorization: adminToken });
        const errorMessage = res.body.error;

        expect(res.statusCode).toBe(409);
        expect(errorMessage).toBe('Область привязана к другим сущностям! Удаление запрещено.');
      });

      test('с верным id и без всязанных сущностей, должен возвращать statusCode 200 и объект с информацией об удалении с полем deletedCount = 1', async () => {
        const res = await request.delete(`/areas/${createdAreaId}`).set({ Authorization: adminToken });
        const result = res.body;

        expect(res.statusCode).toBe(200);
        expect(result.deletedCount).not.toBeUndefined();
        expect(result.deletedCount).toBe(1);
      });

      test('с корректным, но отсутствующим в базе id, должен возвращать statusCode 404 и сообщение об ошибке', async () => {
        const res = await request.delete(`/areas/${createdAreaId}`).set({ Authorization: adminToken });
        const errorMessage = res.body.error;

        expect(res.statusCode).toBe(404);
        expect(errorMessage).toBe('Область не существует в базе.');
      });
    });
  });
});

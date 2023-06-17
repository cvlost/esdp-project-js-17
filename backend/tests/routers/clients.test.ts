import app from '../app';
import supertest from 'supertest';
import * as crypto from 'crypto';
import * as db from '../db';
import User from '../../models/Users';
import Client from '../../models/Client';
import clientsRouter from '../../routers/clients';

app.use('/clients', clientsRouter);
const request = supertest(app);

const userToken = crypto.randomUUID();
const adminToken = crypto.randomUUID();

const userDto = {
  displayName: `user name`,
  email: `user@mail.com`,
  role: 'user',
  password: '@esdpjs17',
  token: userToken,
};

const adminDto = {
  displayName: `admin name`,
  email: `admin@mail.com`,
  role: 'admin',
  password: '@esdpjs17',
  token: adminToken,
};

export const createClients = async () => {
  return await Client.create({
    companyName: 'test',
    companyKindOfActivity: 'test',
    companyAddress: 'test',
    companyPhone: '0555',
    companyEmail: 'test',
    companySite: 'test',
    companyBirthday: 'test',
    CompanyManagementName: 'test',
    CompanyManagementJobTitle: 'test',
    CompanyManagementBirthday: 'test',
    contactPersonName: 'test',
    contactPersonJobTitle: 'test',
    contactPersonBirthday: 'test',
    advertisingChannel: 'test',
  });
};

describe('clientsRouter', () => {
  beforeAll(async () => {
    await db.connect();
  });

  beforeEach(async () => {
    await db.clear();
    await User.create(userDto, adminDto);
    await createClients();
  });

  afterEach(async () => {
    await db.clear();
  });

  afterAll(async () => {
    await db.disconnect();
  });

  describe('GET /clients', () => {
    test('если неавторизованный пользователь пытается получить список клиентов, должен возвращаться statusCode 401 и объект с сообщением об ошибке', async () => {
      const res = await request.get('/clients');
      const error = res.body.error;

      expect(res.statusCode).toBe(401);
      expect(error).toBe('Отсутствует токен авторизации.');
    });

    test('если пользователь c рандомным токеном пытается получить список клиентов, должен возвращаться statusCode 401 и объект с сообщением об ошибке', async () => {
      const res = await request.get('/clients').set({ Authorization: 'some-random-token' });
      const error = res.body.error;

      expect(res.statusCode).toBe(401);
      expect(error).toBe('Предоставлен неверный токен авторизации.');
    });

    test('если пользователь с ролью "user" пытается получить список клиентов, то должен возвращаться statusCode 403 и ошибка', async () => {
      const res = await request.get('/clients').set({ Authorization: userToken });
      const body = res.body.error;

      expect(res.statusCode).toBe(403);
      expect(body).toBe('Неавторизованный пользователь. Нет прав на совершение действия.');
    });

    test('если пользователь с ролью "admin" пытается получить список клиентов, то должен возвращаться statusCode 200 и массив клиентов длинной 1', async () => {
      const res = await request.get('/clients').set({ Authorization: adminToken });
      const clientsList = res.body;

      expect(res.statusCode).toBe(200);
      expect(Array.isArray(clientsList)).toBe(true);
      expect(clientsList.length).toBe(1);
    });
  });

  describe('GET/:id /clients', () => {
    test('если неавторизованный пользователь пытается получить одного клиента, должен возвращаться statusCode 401 и объект с сообщением об ошибке', async () => {
      const res = await request.get('/clients/id');
      const error = res.body.error;

      expect(res.statusCode).toBe(401);
      expect(error).toBe('Отсутствует токен авторизации.');
    });

    test('если пользователь c рандомным токеном пытается получить одного клиента, должен возвращаться statusCode 401 и объект с сообщением об ошибке', async () => {
      const res = await request.get('/clients/id').set({ Authorization: 'some-random-token' });
      const error = res.body.error;

      expect(res.statusCode).toBe(401);
      expect(error).toBe('Предоставлен неверный токен авторизации.');
    });

    test('если пользователь с ролью "user" пытается получить одного клиента, то должен возвращаться statusCode 403 и ошибка', async () => {
      const client = await createClients();

      const res = await request.get(`/clients/${client._id}`).set({ Authorization: userToken });
      const body = res.body.error;

      expect(res.statusCode).toBe(403);
      expect(body).toBe('Неавторизованный пользователь. Нет прав на совершение действия.');
    });

    test('если пользователь с ролью "admin" пытается получить одного клиента, то должен возвращаться statusCode 200 и обьект клиента', async () => {
      const client = await createClients();

      const res = await request.get(`/clients/${client._id}`).set({ Authorization: adminToken });
      const body = res.body;

      expect(res.statusCode).toBe(200);
      expect(body._id).not.toBeUndefined();
      expect(body.companyName).not.toBeUndefined();
    });
    describe('post /clients', () => {
      test('если неавторизованный пользователь пытается создать нового клиента, то должен возвращаться statusCode 401 и объект с сообщением об ошибке', async () => {
        const res = await request.post('/clients').send(createClients());
        const errorMessage = res.body.error;

        expect(res.statusCode).toBe(401);
        expect(errorMessage).toBe('Отсутствует токен авторизации.');
      });
      test('если пользователь c рандомным токеном пытается создать нового клиента, должен возвращаться statusCode 401 и объект с сообщением об ошибке', async () => {
        const res = await request.post('/clients').set({ Authorization: 'some-random-token' }).send(createClients());
        const errorMessage = res.body.error;

        expect(res.statusCode).toBe(401);
        expect(errorMessage).toBe('Предоставлен неверный токен авторизации.');
      });
      test('если пользователь с ролью "user" пытается создать нового клиента, то должен возвращаться statusCode 201 и объект с сообщением и созданного клиента', async () => {
        const res = await request.post('/clients').set({ Authorization: userToken }).send({
          companyName: 'test',
          companyKindOfActivity: 'test',
          companyAddress: 'test',
          companyPhone: '0555',
          companyEmail: 'test',
          companySite: 'test',
          companyBirthday: 'test',
          CompanyManagementName: 'test',
          CompanyManagementJobTitle: 'test',
          CompanyManagementBirthday: 'test',
          contactPersonName: 'test',
          contactPersonJobTitle: 'test',
          contactPersonBirthday: 'test',
          advertisingChannel: 'test',
        });
        const body = res.body;

        expect(res.statusCode).toBe(200);
        expect(body._id).not.toBeUndefined();
        expect(body.companyName).not.toBeUndefined();
      });
    });
    describe('put /clients', () => {
      test('если неавторизованный пользователь пытается редактировать одного клиента, должен возвращаться statusCode 401 и объект с сообщением об ошибке', async () => {
        const res = await request.put('/clients/id');
        const error = res.body.error;

        expect(res.statusCode).toBe(401);
        expect(error).toBe('Отсутствует токен авторизации.');
      });

      test('если пользователь c рандомным токеном пытается редактировать одного клиента, должен возвращаться statusCode 401 и объект с сообщением об ошибке', async () => {
        const res = await request.put('/clients/id').set({ Authorization: 'some-random-token' });
        const error = res.body.error;

        expect(res.statusCode).toBe(401);
        expect(error).toBe('Предоставлен неверный токен авторизации.');
      });

      test('если пользователь с ролью "user" пытается редактировать одного клиента, то должен возвращаться statusCode 403 и ошибка', async () => {
        const res = await request.put(`/clients/id`).set({ Authorization: userToken });
        const body = res.body.error;

        expect(res.statusCode).toBe(403);
        expect(body).toBe('Неавторизованный пользователь. Нет прав на совершение действия.');
      });

      test('если пользователь с ролью "admin" пытается редактировать одного клиента, то должен возвращаться statusCode 200', async () => {
        const client = await createClients();

        const res = await request.put(`/clients/${client._id}`).set({ Authorization: adminToken }).send({
          companyName: 'test edit',
        });
        const body = res.body;
        const newClient = await Client.findOne({ _id: body._id });

        expect(res.statusCode).toBe(200);

        if (newClient) expect(body.companyName).toBe(newClient.companyName);
      });
    });
    describe('delete /clients', () => {
      test('если неавторизованный пользователь пытается удалить одного клиента, должен возвращаться statusCode 401 и объект с сообщением об ошибке', async () => {
        const res = await request.delete('/clients/id');
        const error = res.body.error;

        expect(res.statusCode).toBe(401);
        expect(error).toBe('Отсутствует токен авторизации.');
      });

      test('если пользователь c рандомным токеном пытается удалить одного клиента, должен возвращаться statusCode 401 и объект с сообщением об ошибке', async () => {
        const res = await request.delete('/clients/id').set({ Authorization: 'some-random-token' });
        const error = res.body.error;

        expect(res.statusCode).toBe(401);
        expect(error).toBe('Предоставлен неверный токен авторизации.');
      });
      test('если пользователь с ролью "user" пытается удалить одного клиента, то должен возвращаться statusCode 403 и ошибка', async () => {
        const res = await request.delete(`/clients/id`).set({ Authorization: userToken });
        const body = res.body.error;

        expect(res.statusCode).toBe(403);
        expect(body).toBe('Неавторизованный пользователь. Нет прав на совершение действия.');
      });

      test('если пользователь с ролью "admin" пытается удалить одного клиента, то должен возвращаться statusCode 200', async () => {
        const client = await createClients();

        const res = await request.delete(`/clients/${client._id}`).set({ Authorization: adminToken });
        const body = res.body;

        expect(res.statusCode).toBe(200);
        expect(body.deletedCount).toBe(1);
      });
    });
  });
});

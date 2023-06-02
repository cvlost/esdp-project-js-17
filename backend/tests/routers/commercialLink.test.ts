import app from '../app';
import supertest from 'supertest';
import * as db from '../db';
import User from '../../models/Users';
import * as crypto from 'crypto';
import CommercialLink from '../../models/CommercialLink';
import { createOneLocation } from './locations.test';
import commercialLinksRouter from '../../routers/commercialLinks';
import { CommercialLinkType } from '../../types';
import { expect } from '@jest/globals';

app.use('/link', commercialLinksRouter);
const request = supertest(app);

const token = crypto.randomUUID();
const shorUrlR = crypto.randomUUID();

const sendLink = {
  settings: [
    { id: '1', name: 'addressNote', show: false },
    { id: '2', name: 'area', show: false },
    { id: '3', name: 'city', show: false },
    { id: '4', name: 'region', show: false },
    { id: '5', name: 'street', show: false },
    { id: '6', name: 'direction', show: false },
    { id: '7', name: 'legalEntity', show: false },
    { id: '8', name: 'size', show: true },
    { id: '9', name: 'format', show: true },
    { id: '10', name: 'lighting', show: true },
    { id: '11', name: 'placement', show: true },
    { id: '12', name: 'price', show: true },
    { id: '13', name: 'rent', show: true },
    { id: '14', name: 'reserve', show: true },
  ],
  description: 'test description',
  title: 'test title',
  shortUrl: shorUrlR,
  fullLink: `http://localhost:8000/link/${shorUrlR}`,
};

const createLink = async () => {
  const location = await createOneLocation();

  return await CommercialLink.create({
    location: location._id,
    ...sendLink,
  });
};

const createAllLink = async () => {
  const listLink: CommercialLinkType[] = [];

  for (let i = 0; i < 30; i++) {
    const link = await createLink();
    listLink.push(link);
  }

  return listLink;
};

describe('commercialLinkRouter', () => {
  beforeAll(async () => {
    await db.connect();
  });

  beforeEach(async () => {
    await db.clear();
    await User.create({
      displayName: `user name`,
      email: `user@mail.com`,
      role: 'user',
      password: '123',
      token: token,
    });
    await createLink();
    await createOneLocation();
  });

  afterEach(async () => {
    await db.clear();
  });

  afterAll(async () => {
    await db.disconnect();
  });

  describe('GET /listLink', () => {
    test('если неавторизованный пользователь пытается получить список ссылок, должен возвращаться statusCode 401 и объект с сообщением об ошибке', async () => {
      const res = await request.get('/link/listLink');
      const errorMessage = res.body.error;

      expect(res.statusCode).toBe(401);
      expect(errorMessage).toBe('Отсутствует токен авторизации.');
    });

    test('если пользователь c рандомным токеном пытается получить список ссылок, должен возвращаться statusCode 401 и объект с сообщением об ошибке', async () => {
      const res = await request.get('/link/listLink').set({ Authorization: 'some-random-token' });
      const errorMessage = res.body.error;

      expect(res.statusCode).toBe(401);
      expect(errorMessage).toBe('Предоставлен неверный токен авторизации.');
    });

    test('если пользователь пытается получить список ссылок, то должен возвращаться statusCode 200 и массив ссылок', async () => {
      const locationsNumber = 1;
      const expectedPage = 1;
      const expectedPages = 1;
      const expectedPerPage = 10;
      const res = await request.get('/link/listLink').set({ Authorization: token });
      const linkList: {
        listLink: CommercialLinkType[];
        page: number;
        pages: number;
        listLinkLength: number;
        perPage: number;
      } = res.body;

      expect(res.statusCode).toBe(200);
      expect(Array.isArray(linkList.listLink)).toBe(true);
      expect(linkList.listLink.length).toBe(locationsNumber);
      expect(linkList.page).toBe(expectedPage);
      expect(linkList.pages).toBe(expectedPages);
      expect(linkList.perPage).toBe(expectedPerPage);
    });

    test('если пользователь пытается получить список ссылок, с ипользованием пагинации то возвращается statusCode 200 и массив ссылок', async () => {
      const locationsNumber = 10;
      const expectedPage = 3;
      const expectedPages = 4;
      const expectedPerPage = 10;
      await createAllLink();

      const res = await request
        .get(`/link/listLink?page=${expectedPage}&perPage=${expectedPerPage}`)
        .set({ Authorization: token });
      const body = res.body;

      expect(res.statusCode).toBe(200);
      expect(Array.isArray(body.listLink)).toBe(true);
      expect(body.listLink.length).toBe(locationsNumber);
      expect(body.page).toBe(expectedPage);
      expect(body.pages).toBe(expectedPages);
      expect(body.perPage).toBe(expectedPerPage);
    });
  });
  describe('get /link/:id', () => {
    test('Если произвести редирект на не существующий id, то должен возвращаться statusCode 404 и сообщение "Ссылка недествительна !"', async () => {
      const res = await request.get('/link/randomId');
      const body = res.body;

      expect(res.statusCode).toBe(404);
      expect(body).toStrictEqual({ message: 'Ссылка недествительна !' });
    });
  });
  describe('post /link', () => {
    test('если неавторизованный пользователь пытается создать новую ссылку, то должен возвращаться statusCode 401 и объект с сообщением об ошибке"', async () => {
      const location = await createOneLocation();
      const res = await request.post('/link').send({
        location: location._id,
        ...sendLink,
      });
      const body = res.body.error;
      expect(res.statusCode).toBe(401);
      expect(body).toBe('Отсутствует токен авторизации.');
    });
    test('если пользователь c рандомным токеном пытается создать новую ссылку, должен возвращаться statusCode 401 и объект с сообщением об ошибке"', async () => {
      const location = await createOneLocation();
      const res = await request
        .post('/link')
        .send({
          location: location._id,
          ...sendLink,
        })
        .set({ Authorization: 'some-random-token' });
      const body = res.body.error;
      expect(res.statusCode).toBe(401);
      expect(body).toBe('Предоставлен неверный токен авторизации.');
    });
    test('если пользователь пытается создать новую ссылку, должен возвращаться statusCode 201 и объект с сообщением и созданной ссылкой"', async () => {
      const location = await createOneLocation();
      const res = await request
        .post('/link')
        .send({
          location: location._id,
          ...sendLink,
        })
        .set({ Authorization: token });
      const body = res.body;
      expect(res.statusCode).toBe(200);
      expect(body.newCommLink._id).not.toBeUndefined();
      expect(body.newCommLink.shortUrl).not.toBeUndefined();
      expect(body.message).toBe('Новая область успешно создана');
    });
  });
  describe('get /location/:id', () => {
    test('если у пользователя не правильный id, до должен возвращаться sendStatus 500 и ошибка', async () => {
      const res = await request.get('/link/location/randomId');
      expect(res.statusCode).toBe(500);
    });

    test('если данного id нет в базе данных, то должен возвращаться sendStatus 404 и сообщение "Ссылка недействительна !"', async () => {
      const res = await request.get('/link/location/6468f5f76a50661df9421b48');
      const body = res.body;
      expect(res.statusCode).toBe(404);
      expect(body).toStrictEqual({ error: 'Ссылка недействительна !' });
    });

    test('если у пользователя правильный id, до должен возвращаться обьект с массивом location и title, description', async () => {
      const link = await createLink();
      const res = await request.get(`/link/location/${link._id}`);
      const body = res.body;
      expect(res.statusCode).toBe(200);
      expect(Array.isArray(body.location)).toBe(true);
      expect(body.location.length).toBe(1);
    });
  });
  describe('get /location/:idLink/locationOne/:idLoc', () => {
    test('если передать не верный idLink и idLoc, то должен возвращаться sendStatus 500 и ошибка', async () => {
      const res = await request.get('/link/location/randomId/locationOne/randomId');
      expect(res.statusCode).toBe(500);
    });

    test('если у пользователя правильный idLink и idLoc, до должен возвращаться обьект с location и title и description', async () => {
      const link = await createLink();
      const location = await createOneLocation();
      const res = await request.get(`/link/location/${link._id}/locationOne/${location._id}`);
      const body = res.body;
      expect(res.statusCode).toBe(200);
      expect(body.title).toBe(link.title);
      expect(body.description).toBe(link.description);
      expect(body.location._id).not.toBeUndefined();
    });
  });

  describe('delete /link/:id', () => {
    test('если неавторизованный пользователь пытается удалить ссылку по id, должен возваращаться statusCode 401 и сообщение об ошибке', async () => {
      const res = await request.delete('/link/randomId');
      const body = res.body.error;
      expect(res.statusCode).toBe(401);
      expect(body).toBe('Отсутствует токен авторизации.');
    });

    test('если пользователь c рандомным токеном пытается удалить ссылку по id, должен возвращаться statusCode 401 и объект с сообщением об ошибке', async () => {
      const res = await request.delete('/link/randomId').set({ Authorization: 'some-random-token' });
      const body = res.body.error;
      expect(res.statusCode).toBe(401);
      expect(body).toBe('Предоставлен неверный токен авторизации.');
    });

    test('если пользователь пытается удалить ссылку по неправильному id, должен возвращаться statusCode 422 и объект с сообщением об ошибке', async () => {
      const res = await request.delete('/link/randomId').set({ Authorization: token });
      const body = res.body.error;
      expect(res.statusCode).toBe(422);
      expect(body).toBe('Некорректный id ссылки.');
    });

    test('если пользователь пытается удалить ссылку по правильному id, должен возвращаться statusCode 200', async () => {
      const link = await createLink();
      const res = await request.delete(`/link/${link._id}`).set({ Authorization: token });
      expect(res.statusCode).toBe(200);
    });
  });
});

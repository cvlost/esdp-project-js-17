import crypto from 'crypto';
import * as db from '../db';
import User from '../../models/Users';
import Booking from '../../models/Booking';
import { createClients } from './clients.test';
import { createOneLocation } from './locations.test';
import app from '../app';
import supertest from 'supertest';
import bookingsRouter from '../../routers/bookings';

app.use('/bookings', bookingsRouter);
const request = supertest(app);
const userToken = crypto.randomUUID();
const userDto = {
  displayName: `user name`,
  email: `user@mail.com`,
  role: 'user',
  password: '@esdpjs17',
  token: userToken,
};

let idLoc = '';
let idBook = '';

const createBooking = async () => {
  const clientId = await createClients();
  const locationId = await createOneLocation();
  idLoc = locationId._id.toString();
  const booking = await Booking.create({
    clientId: clientId.id,
    locationId: locationId.id,
    booking_date: null,
  });
  idBook = booking._id.toString();
};
describe('bookingsRouter', () => {
  beforeAll(async () => {
    await db.connect();
  });
  beforeEach(async () => {
    await db.clear();
    await User.create(userDto);
    await createBooking();
  });
  afterEach(async () => {
    await db.clear();
  });
  afterAll(async () => {
    await db.disconnect();
  });
  describe('GET/:id /bookings/', () => {
    test('если неавторизованный пользователь пытается получить бронь, должен возвращаться statusCode 401 и объект с сообщением об ошибке', async () => {
      const res = await request.get('/bookings/test');
      const error = res.body.error;
      expect(res.statusCode).toBe(401);
      expect(error).toBe('Отсутствует токен авторизации.');
    });
    test('если пользователь c рандомным токеном пытается получить бронь, должен возвращаться statusCode 401 и объект с сообщением об ошибке', async () => {
      const res = await request.get('/bookings/test').set({ Authorization: 'some-random-token' });
      const error = res.body.error;
      expect(res.statusCode).toBe(401);
      expect(error).toBe('Предоставлен неверный токен авторизации.');
    });
    test('если пользователь с ролью "user" пытается получить бронь, то должен возвращаться statusCode 200 и локация с массивом броней', async () => {
      const res = await request.get(`/bookings/${idLoc}`).set({ Authorization: userToken });
      const body = res.body;
      expect(res.statusCode).toBe(200);
      expect(body.price).not.toBeUndefined();
    });
    test('если пользователь с ролью "user" пытается получить бронь c неправильным id, то должен возвращаться statusCode 422 и ошибка', async () => {
      const res = await request.get(`/bookings/123`).set({ Authorization: userToken });
      const body = res.body.error;
      expect(res.statusCode).toBe(422);
      expect(body).toBe('Некорректный id брони.');
    });
  });
  describe('POST/ /bookings', () => {
    test('если неавторизованный пользователь пытается создать новую бронь, то должен возвращаться statusCode 401 и объект с сообщением об ошибке', async () => {
      const clientId = await createClients();
      const locationId = await createOneLocation();
      const res = await request
        .post('/bookings')
        .send({ clientId: clientId.id, locationId: locationId.id, booking_date: null });
      const errorMessage = res.body.error;
      expect(res.statusCode).toBe(401);
      expect(errorMessage).toBe('Отсутствует токен авторизации.');
    });
    test('если пользователь c рандомным токеном пытается создать новую бронь, должен возвращаться statusCode 401 и объект с сообщением об ошибке', async () => {
      const clientId = await createClients();
      const locationId = await createOneLocation();
      const res = await request
        .post('/bookings')
        .set({ Authorization: 'some-random-token' })
        .send({ clientId: clientId.id, locationId: locationId.id, booking_date: null });
      const errorMessage = res.body.error;
      expect(res.statusCode).toBe(401);
      expect(errorMessage).toBe('Предоставлен неверный токен авторизации.');
    });
    test('если пользователь с ролью "user" пытается создать новую бронь, то должен возвращаться statusCode 201 и объект', async () => {
      const clientId = await createClients();
      const locationId = await createOneLocation();
      const res = await request
        .post('/bookings')
        .set({ Authorization: userToken })
        .send({ clientId: clientId.id, locationId: locationId.id, booking_date: null });
      const body = res.body;
      expect(res.statusCode).toBe(200);
      expect(body.clientId).not.toBeUndefined();
      expect(body.locationId).not.toBeUndefined();
    });
    describe('DELETE/ /bookings', () => {
      test('если неавторизованный пользователь пытается удалить бронь, должен возвращаться statusCode 401 и объект с сообщением об ошибке', async () => {
        const res = await request.delete('/bookings/id/id');
        const error = res.body.error;
        expect(res.statusCode).toBe(401);
        expect(error).toBe('Отсутствует токен авторизации.');
      });
      test('если пользователь c рандомным токеном пытается удалить бронь, должен возвращаться statusCode 401 и объект с сообщением об ошибке', async () => {
        const res = await request.delete('/bookings/id/id').set({ Authorization: 'some-random-token' });
        const error = res.body.error;
        expect(res.statusCode).toBe(401);
        expect(error).toBe('Предоставлен неверный токен авторизации.');
      });
      test('если пользователь с ролью "user" пытается удалить бронь, то должен возвращаться statusCode 200', async () => {
        const res = await request.delete(`/bookings/${idLoc}/${idBook}`).set({ Authorization: userToken });
        const body = res.body;
        expect(res.statusCode).toBe(200);
        expect(body.removeLoc).toBe(idLoc);
        expect(body.removeBook).toBe(idBook);
      });
    });
  });
});

import { randomUUID } from 'crypto';
import supertest from 'supertest';
import app from '../app';
import usersRouter from '../../routers/users';
import * as db from '../db';
import User from '../../models/Users';
import { IUser } from '../../types';

app.use('/users', usersRouter);
const request = supertest(app);

const addUsersToDb = async (number: number) => {
  const fixtureUsersList: IUser[] = [];

  for (let i = 0; i < number; i++) {
    fixtureUsersList.push({
      displayName: `fixture-user${i}`,
      email: `test${i}@test.com`,
      role: 'user',
      password: '@esdpjs17',
      token: randomUUID(),
    });
  }

  await User.create(...fixtureUsersList);
};

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
const candidateDto = {
  displayName: `candidate name`,
  email: `candidate@mail.com`,
  role: 'user',
  password: '@esdpjs17',
};

describe('usersRouter', () => {
  let adminId: string;
  let userId: string;

  beforeAll(async () => {
    await db.connect();
  });

  beforeEach(async () => {
    await db.clear();

    const [admin, user] = await User.create(adminDto, userDto);
    adminId = admin._id.toString();
    userId = user._id.toString();
  });

  afterEach(async () => {
    await db.clear();
  });

  afterAll(async () => {
    await db.disconnect();
  });

  describe('POST /users', () => {
    test('если неавторизованный пользователь пытается создать нового пользователя, должен возвращаться statusCode 401 и сообщение об ошибке', async () => {
      const res = await request.post('/users').send(candidateDto);
      const errorMessage = res.body.error;

      expect(res.statusCode).toBe(401);
      expect(errorMessage).toBe('Отсутствует токен авторизации.');
    });

    test('если пользователь с рандомным токеном пытается создать нового пользователя, должен возвращаться statusCode 401 и сообщение об ошибке', async () => {
      const res = await request.post('/users').send(candidateDto).set({ Authorization: 'some-random-token' });
      const errorMessage = res.body.error;

      expect(res.statusCode).toBe(401);
      expect(errorMessage).toBe('Предоставлен неверный токен авторизации.');
    });

    test('если пользователь с ролью "user" пытается создать нового пользователя, должен возвращаться statusCode 403 и сообщение о недостаточных правах на дейстие', async () => {
      const res = await request.post('/users').send(candidateDto).set({ Authorization: userToken });
      const errorMessage = res.body.error;

      expect(res.statusCode).toBe(403);
      expect(errorMessage).toBe('Неавторизованный пользователь. Нет прав на совершение действия.');
    });

    describe('если пользователь с ролью "admin" пытается создать нового пользователя', () => {
      test('с некорректными по форме данными, дожен возвращаться statusCode 422 и объект ValidationError с описанием ошибок', async () => {
        const res = await request
          .post('/users')
          .send({ displayName: 'Only Name Provided' })
          .set({ Authorization: adminToken });
        const validationError = res.body;

        expect(res.statusCode).toBe(422);
        expect(validationError.name).toBe('ValidationError');
        expect(validationError.errors.displayName).toBeUndefined();
        expect(validationError.errors.role).toBeUndefined();
        expect(validationError.errors.password).not.toBeUndefined();
        expect(validationError.errors.email).not.toBeUndefined();
      });
      test('c корректными данными, но повторным email нового пользователя, должен возвращать statusCode 422 и объект ValidationError с описанием ошибки duplicate email', async () => {
        const res = await request
          .post('/users')
          .send({
            ...candidateDto,
            email: userDto.email,
          })
          .set({ Authorization: adminToken });
        const validationError = res.body;

        expect(res.statusCode).toBe(422);
        expect(validationError.name).toBe('ValidationError');
        expect(validationError.errors.email).not.toBeUndefined();
      });
      test('c корректными данными, должен возвращать statusCode 201 и объект c информацией о создании - сообщение и созданный пользователь без лишней информации с корректными полями', async () => {
        const res = await request.post('/users').send(candidateDto).set({ Authorization: adminToken });
        const { message, user } = res.body;

        expect(res.statusCode).toBe(201);
        expect(message).toBe('Новый пользователь успешно зарегистрирован!');
        expect(user._id).not.toBeUndefined();
        expect(user.password).toBeUndefined();
        expect(user.displayName).toBe(candidateDto.displayName);
        expect(user.email).toBe(candidateDto.email);
        expect(user.role).toBe(candidateDto.role);
      });
    });
  });

  describe('GET /users', () => {
    test('если неавторизованный пользователь пытается получить список всех пользователей, должен возвращать statusCode 401 и сообщение об ошибке', async () => {
      const res = await request.get('/users');
      const errorMessage = res.body.error;

      expect(res.statusCode).toBe(401);
      expect(errorMessage).toBe('Отсутствует токен авторизации.');
    });

    test('если пользователь с рандомным токеном пытается получить список всех пользователей, должен возвращать statusCode 401 и сообщение об ошибке', async () => {
      const res = await request.get('/users').set({ Authorization: 'some-random-token' });
      const errorMessage = res.body.error;

      expect(res.statusCode).toBe(401);
      expect(errorMessage).toBe('Предоставлен неверный токен авторизации.');
    });

    test('если пользователь с ролью "user" пытается получить список всех пользователей, должен возвращать statusCode 403 и сообщение о недостаточных правах', async () => {
      const res = await request.get('/users').set({ Authorization: userToken });
      const errorMessage = res.body.error;

      expect(res.statusCode).toBe(403);
      expect(errorMessage).toBe('Неавторизованный пользователь. Нет прав на совершение действия.');
    });

    describe('если пользователь с ролью "admin" пытается получить список всех пользователей', () => {
      test('c query params page=1 & perPage = 15, должен возвращать statusCode 200 и объект с 5 полями users, page, pages, perPage, count для пагинации', async () => {
        await addUsersToDb(98);
        const page = 1;
        const perPage = 15;
        const res = await request.get(`/users?page=${page}&perPage=${perPage}`).set({ Authorization: adminToken });
        const usersListData = res.body;

        expect(res.statusCode).toBe(200);
        expect(Array.isArray(usersListData)).not.toBe(true);

        expect(usersListData.users).not.toBeUndefined();
        expect(Array.isArray(usersListData.users)).toBe(true);
        expect(usersListData.users.length).toBe(perPage);
        expect(usersListData.page).not.toBeUndefined();
        expect(usersListData.page).toBe(page);
        expect(usersListData.pages).not.toBeUndefined();
        expect(usersListData.pages).toBe(Math.ceil(100 / 15));
        expect(usersListData.perPage).not.toBeUndefined();
        expect(usersListData.perPage).toBe(perPage);
        expect(usersListData.count).not.toBeUndefined();
        expect(usersListData.count).toBe(await User.count());
      }, 20_000);

      test('без query параметров page & perPage, должен возвращать statusCode 200 и верные данные для пагинации', async () => {
        await addUsersToDb(98);
        const res = await request.get(`/users`).set({ Authorization: adminToken });
        const usersListData = res.body;

        expect(res.statusCode).toBe(200);
        expect(usersListData.users.length).toBe(10);
        expect(usersListData.page).toBe(1);
        expect(usersListData.pages).toBe(10);
        expect(usersListData.perPage).toBe(10);
        expect(usersListData.count).toBe(await User.count());
      }, 20_000);

      test('с невалидными query параметрами page=100_000 & perPage=-200, должен возвращать statusCode 200 и верные данные для пагинации', async () => {
        await addUsersToDb(105);
        const page = 100_000;
        const perPage = -200;
        const res = await request.get(`/users?page=${page}&perPage=${perPage}`).set({ Authorization: adminToken });
        const usersListData = res.body;

        expect(res.statusCode).toBe(200);
        expect(usersListData.users.length).toBe(7);
        expect(usersListData.page).toBe(11);
        expect(usersListData.pages).toBe(11);
        expect(usersListData.perPage).toBe(10);
        expect(usersListData.count).toBe(await User.count());
      }, 20_000);
    });
  });

  describe('GET /users/:id', () => {
    test('если неавторизованный пользователь пытается получить информацию об 1 пользователе по id, должен возвращать statusCode 401 и сообщение об ошибке', async () => {
      const res = await request.get(`/users/${adminId}`);
      const errorMessage = res.body.error;

      expect(res.statusCode).toBe(401);
      expect(errorMessage).toBe('Отсутствует токен авторизации.');
    });

    test('если пользователь с рандомным токеном пытается получить информацию об 1 пользователе по id, должен возвращать statusCode 401 и сообщение об ошибке', async () => {
      const res = await request.get(`/users/${adminId}`).set({ Authorization: 'some-random-token' });
      const errorMessage = res.body.error;

      expect(res.statusCode).toBe(401);
      expect(errorMessage).toBe('Предоставлен неверный токен авторизации.');
    });

    describe('если пользователь с ролью "user" пытается получить информацию об 1 пользователе', () => {
      test('с корректным id должен возвращать statusCode 200 и объект пользователя с 5 полями displayName, email, role, token, _id ', async () => {
        const expectedUserDto = { ...adminDto, _id: adminId, token: adminToken, password: undefined };
        const res = await request.get(`/users/${adminId}`).set({ Authorization: userToken });
        const user = res.body;

        expect(res.statusCode).toBe(200);
        expect(user.email).not.toBeUndefined();
        expect(user.displayName).not.toBeUndefined();
        expect(user.role).not.toBeUndefined();
        expect(user.token).not.toBeUndefined();
        expect(user._id).not.toBeUndefined();
        expect(user.password).toBeUndefined();
        expect(user).toEqual(expectedUserDto);
      });

      test('с некорректным по форме mongodb id, должен возвращать statusCode 422 и объект с сообщением об ошибке', async () => {
        const res = await request.get(`/users/some-random-invalid-id`).set({ Authorization: userToken });
        const errorMessage = res.body.error;

        expect(res.statusCode).toBe(422);
        expect(errorMessage).toBe('Некорректный id пользователя.');
      });

      test('с корректным по форме mongodb id, но отсутсвующим в базе, должен возвращать statusCode 404 и объект с сообщением об ошибке', async () => {
        const validRandomMongoId = '64708be8833201837ddd4078';
        const res = await request.get(`/users/${validRandomMongoId}`).set({ Authorization: userToken });
        const errorMessage = res.body.error;

        expect(res.statusCode).toBe(404);
        expect(errorMessage).toBe('Пользователь не найден.');
      });
    });

    describe('если пользователь с ролью "admin" пытается получить информацию об 1 пользователе', () => {
      test('с корректным id должен возвращать statusCode 200 и объект пользователя с 5 полями displayName, email, role, token, _id ', async () => {
        const expectedUserDto = { ...adminDto, _id: adminId, token: adminToken, password: undefined };
        const res = await request.get(`/users/${adminId}`).set({ Authorization: adminToken });
        const user = res.body;

        expect(res.statusCode).toBe(200);
        expect(user.displayName).not.toBeUndefined();
        expect(user.email).not.toBeUndefined();
        expect(user.role).not.toBeUndefined();
        expect(user.token).not.toBeUndefined();
        expect(user._id).not.toBeUndefined();
        expect(user.password).toBeUndefined();
        expect(user).toEqual(expectedUserDto);
      });

      test('с некорректным по форме mongodb id, должен возвращать statusCode 422 и объект с сообщением об ошибке', async () => {
        const res = await request.get(`/users/some-random-invalid-id`).set({ Authorization: adminToken });
        const errorMessage = res.body.error;

        expect(res.statusCode).toBe(422);
        expect(errorMessage).toBe('Некорректный id пользователя.');
      });

      test('с корректным по форме mongodb id, но отсутсвующим в базе, должен возвращать statusCode 404 и объект с сообщением об ошибке', async () => {
        const validRandomMongoId = '64708be8833201837ddd4078';
        const res = await request.get(`/users/${validRandomMongoId}`).set({ Authorization: adminToken });
        const errorMessage = res.body.error;

        expect(res.statusCode).toBe(404);
        expect(errorMessage).toBe('Пользователь не найден.');
      });
    });
  });

  describe('PUT /users/:id', () => {
    test('если неавторизованный пользователь пытается произвести редактирование, должен возвращать statusCode 401 и сообщение об ошибке', async () => {
      const res = await request.put(`/users/${adminId}`);
      const errorMessage = res.body.error;

      expect(res.statusCode).toBe(401);
      expect(errorMessage).toBe('Отсутствует токен авторизации.');
    });

    test('если пользователь с рандомным токеном пытается произвести редактирование, должен возвращать statusCode 401 и сообщение об ошибке', async () => {
      const res = await request.put(`/users/${adminId}`).set({ Authorization: 'some-random-token' });
      const errorMessage = res.body.error;

      expect(res.statusCode).toBe(401);
      expect(errorMessage).toBe('Предоставлен неверный токен авторизации.');
    });

    describe('если пользователь с ролью "user" пытается произвести редактирование', () => {
      test('самого себя предоставляя корректные данные, должен возвращать statusCode 200 объект с сообщением и отредактированного пользователя', async () => {
        const res = await request
          .put(`/users/${userId}`)
          .set({ Authorization: userToken })
          .send({ displayName: 'Updated Name by a User' });
        const { message, user } = res.body;

        expect(res.statusCode).toBe(200);
        expect(message).toBe('Пользователь успешно отредактирован!');
        expect(user).toEqual({
          ...userDto,
          token: userToken,
          password: undefined,
          _id: userId,
          displayName: 'Updated Name by a User',
        });
      });

      test('самого себя предоставляя некорректные данные, должен возвращать statusCode 422 и объект ValidationError', async () => {
        const res = await request.put(`/users/${userId}`).set({ Authorization: userToken }).send({ displayName: [] });
        const name = res.body.name;

        expect(res.statusCode).toBe(422);
        expect(name).toBe('ValidationError');
      });

      test('другого пользователя, предоставляя любые данные, должен возвращать statusCode 403 объект с сообщением о недостаточных правах', async () => {
        const res = await request
          .put(`/users/${adminId}`)
          .set({ Authorization: userToken })
          .send({ displayName: 'Updated Name Of an Admin by a User' });
        const errorMessage = res.body.error;

        expect(res.statusCode).toBe(403);
        expect(errorMessage).toBe('Неавторизованный пользователь. Нет прав на совершение действия.');
      });
    });

    describe('если пользователь с ролью "admin" пытается произвести редактирование', () => {
      test('указав некорректный mongodb id, должен возвращать statusCode 422 и сообщение об ошибке', async () => {
        const res = await request
          .put(`/users/random-invalid-id`)
          .set({ Authorization: adminToken })
          .send({ displayName: 'Updated Name by an Admin' });
        const errorMessage = res.body.error;

        expect(res.statusCode).toBe(422);
        expect(errorMessage).toBe('Некорректный id пользователя.');
      });

      test('указав корректный, но не существующий в базе mongodb id, должен возвращать statusCode 404 и сообщение об ошибке', async () => {
        const validRandomMongoId = '64708be8833201837ddd4078';
        const res = await request
          .put(`/users/${validRandomMongoId}`)
          .set({ Authorization: adminToken })
          .send({ displayName: 'Updated Name by an Admin' });
        const errorMessage = res.body.error;

        expect(res.statusCode).toBe(404);
        expect(errorMessage).toBe('Пользователь не найден.');
      });

      test('самого себя предоставляя корректные данные, должен возвращать statusCode 200 объект с сообщением и отредактированного пользователя', async () => {
        const res = await request
          .put(`/users/${adminId}`)
          .set({ Authorization: adminToken })
          .send({ displayName: 'Updated Name by an Admin' });
        const { message, user } = res.body;

        expect(res.statusCode).toBe(200);
        expect(message).toBe('Пользователь успешно отредактирован!');
        expect(user).toEqual({
          ...adminDto,
          token: adminToken,
          password: undefined,
          _id: adminId,
          displayName: 'Updated Name by an Admin',
        });
      });

      test('самого себя предоставляя некорректные данные, должен возвращать statusCode 422 и объект ValidationError', async () => {
        const res = await request.put(`/users/${adminId}`).set({ Authorization: adminToken }).send({ displayName: [] });
        const name = res.body.name;

        expect(res.statusCode).toBe(422);
        expect(name).toBe('ValidationError');
      });

      test('другого пользователя, предоставляя корректные данные, должен возвращать statusCode 403 объект с сообщением о недостаточных правах', async () => {
        const res = await request
          .put(`/users/${userId}`)
          .set({ Authorization: adminToken })
          .send({ displayName: 'Updated Name by an Admin' });
        const { message, user } = res.body;

        expect(res.statusCode).toBe(200);
        expect(message).toBe('Пользователь успешно отредактирован!');
        expect(user).toEqual({
          ...userDto,
          token: userToken,
          password: undefined,
          _id: userId,
          displayName: 'Updated Name by an Admin',
        });
      });

      test('другого пользователя, предоставляя некорректные данные, должен возвращать statusCode 422 и объект ValidationError', async () => {
        const res = await request.put(`/users/${userId}`).set({ Authorization: adminToken }).send({ displayName: [] });
        const name = res.body.name;

        expect(res.statusCode).toBe(422);
        expect(name).toBe('ValidationError');
      });
    });
  });

  describe('DELETE /users/sessions', () => {
    test('если logout делает пользователь с рандомным токеном, должен возвращать statusCode 200 и сообщение об успешном выходе', async () => {
      const res = await request.delete(`/users/sessions`).set({ Authorization: 'some-random-token' });
      const message = res.body.message;

      expect(res.statusCode).toBe(200);
      expect(message).toBe('Успешное окончание сессии!');
    });

    test('если logout делает неавторизованный пользователь, должен возвращать statusCode 200 и сообщение об успешном выходе', async () => {
      const res = await request.delete(`/users/sessions`);
      const message = res.body.message;

      expect(res.statusCode).toBe(200);
      expect(message).toBe('Успешное окончание сессии!');
    });

    test('если logout делает авторизованный пользователь, должен измениться токен, возвращать statusCode 200 и сообщение об успешном выходе', async () => {
      const res = await request.delete(`/users/sessions`).set({ Authorization: userToken });
      const message = res.body.message;
      const user = await User.findById(userId);

      expect(res.statusCode).toBe(200);
      expect(user).not.toBeFalsy();
      expect(user?.token).not.toBe(userToken);
      expect(message).toBe('Успешное окончание сессии!');
    });
  });

  describe('DELETE /users/:id', () => {
    test('если неавторизований пользователь пытается удалить любого пользователя, возвращает statusCode 401 и сообщение об ошибке', async () => {
      const res = await request.delete(`/users/${userId}`);
      const errorMessage = res.body.error;

      expect(res.statusCode).toBe(401);
      expect(errorMessage).toBe('Отсутствует токен авторизации.');
    });

    test('если пользователь с рандомным токеном пытается удалить любого пользователя, возвращает statusCode 401 и сообщение об ошибке', async () => {
      const res = await request.delete(`/users/${userId}`).set({ Authorization: 'random-token' });
      const errorMessage = res.body.error;

      expect(res.statusCode).toBe(401);
      expect(errorMessage).toBe('Предоставлен неверный токен авторизации.');
    });

    test('если пользователь с ролью "user" пытается удалить любого пользователя, возвращает statusCode 403 и сообщение о недостаточных правах', async () => {
      const res = await request.delete(`/users/${userId}`).set({ Authorization: userToken });
      const errorMessage = res.body.error;

      expect(res.statusCode).toBe(403);
      expect(errorMessage).toBe('Неавторизованный пользователь. Нет прав на совершение действия.');
    });

    describe('если пользователь с ролью "admin" пытается удалить пользователя', () => {
      test('указывая некорректный по форме mongodb id, возвращает statusCode 422 и сообщение об ошибке', async () => {
        const res = await request.delete(`/users/random-id`).set({ Authorization: adminToken });
        const errorMessage = res.body.error;

        expect(res.statusCode).toBe(422);
        expect(errorMessage).toBe('Некорректный id пользователя.');
      });

      test('указывая корректный, но отсутствующий в базе id, возвращает statusCode 404 и сообщение об ошибке', async () => {
        const validRandomMongoId = '64708be8833201837ddd4078';
        const res = await request.delete(`/users/${validRandomMongoId}`).set({ Authorization: adminToken });
        const errorMessage = res.body.error;

        expect(res.statusCode).toBe(404);
        expect(errorMessage).toBe('Пользователь не найден.');
      });

      test('указывая корректный id, возвращает statusCode 200 и объект с информацией об удалении', async () => {
        const res = await request.delete(`/users/${userId}`).set({ Authorization: adminToken });
        const result = res.body;

        expect(res.statusCode).toBe(200);
        expect(result.deletedCount).toBe(1);
      });

      test('указывая собственный id, должен возвращать statusCode 403 и сообщение о невозможности удаления своего аккаунта', async () => {
        const res = await request.delete(`/users/${adminId}`).set({ Authorization: adminToken });
        const errorMessage = res.body.error;

        expect(res.statusCode).toBe(403);
        expect(errorMessage).toBe('Невозможно удалить собственный аккаунт!');
      });
    });
  });

  describe('POST /users/sessions', () => {
    test('если при входе указывается неверный email, должен возвращать statusCode 422 и сообщение об ошибке', async () => {
      const res = await request.post(`/users/sessions`).send({
        email: 'nonexistent@mail.com',
        password: adminDto.password,
      });
      const errorMessage = res.body.error;

      expect(res.statusCode).toBe(422);
      expect(errorMessage).toBe('Неверная почта или пароль!');
    });
    test('если при входе указывается неверный password, должен возвращать statusCode 422 и сообщение об ошибке', async () => {
      const res = await request.post(`/users/sessions`).send({
        email: adminDto.email,
        password: 'some-random-password',
      });
      const errorMessage = res.body.error;

      expect(res.statusCode).toBe(422);
      expect(errorMessage).toBe('Неверная почта или пароль!');
    });
    test('если при входе указывается верные данные email & password, должен возвращать statusCode 200 и объект с сообщением и пользователя с новым токеном', async () => {
      const res = await request.post(`/users/sessions`).send({
        email: adminDto.email,
        password: adminDto.password,
      });
      const { message, user } = res.body;

      expect(res.statusCode).toBe(200);
      expect(message).toBe('Почта и пароль верные!');
      expect(user.token).not.toBe(adminToken);
      expect(user.email).toBe(adminDto.email);
      expect(user.password).toBeUndefined();
      expect(user.role).toBe('admin');
    });
  });
});

import mongoose from 'mongoose';
import config from './config';
import User from './models/Users';
import { randomUUID } from 'crypto';
import City from './models/City';
import Region from './models/Region';
import Direction from './models/Direction';

const run = async () => {
  mongoose.set('strictQuery', false);
  await mongoose.connect(config.db);
  const db = mongoose.connection;

  try {
    await db.dropCollection('users');
    await db.dropCollection('directions');
    await db.dropCollection('cities');
    await db.dropCollection('regions');
  } catch (e) {
    console.log('Collections were not present, skipping drop...');
  }

  await User.create({
    displayName: 'Admin',
    email: 'test@test.com',
    role: 'admin',
    password: '@esdpjs17',
    token: randomUUID(),
  });

  let role = 'user';

  for (let i = 0; i <= 50; i++) {
    if (i >= 45) {
      role = 'admin';
    }
    await User.create({
      displayName: `Admin${i}`,
      email: `test${i}@test.com`,
      role: role,
      password: '@esdpjs17',
      token: randomUUID(),
    });
  }

  await City.create(
    { name: 'Бишкек' },
    { name: 'Ош' },
    { name: 'Нарын' },
    { name: 'Балыкчы' },
    { name: 'Каракол' },
    { name: 'Талас' },
    { name: 'Кант' },
    { name: 'Чолпон-Ата' },
    { name: 'Кара-Балта' },
    { name: 'Узген' },
  );

  await Region.create(
    { name: 'Первомайский' },
    { name: 'Ленинский' },
    { name: 'Октябрьский' },
    { name: 'Аламудунский' },
    { name: 'Ыссык-Кульский' },
    { name: 'Ысык-Атинский' },
  );

  await Direction.create(
    {
      name: 'Север',
    },
    {
      name: 'Юг',
    },
    {
      name: 'Запад',
    },
    {
      name: 'Восток',
    },
  );

  await db.close();
};

void run();

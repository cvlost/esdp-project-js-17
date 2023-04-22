import mongoose from 'mongoose';
import config from './config';
import User from './models/Users';
import { randomUUID } from 'crypto';
import City from './models/City';
import Region from './models/Region';
import Direction from './models/Direction';
import Location from './models/Location';
import Street from './models/Street';

const run = async () => {
  mongoose.set('strictQuery', false);
  await mongoose.connect(config.db);
  const db = mongoose.connection;

  try {
    await db.dropCollection('users');
    await db.dropCollection('directions');
    await db.dropCollection('cities');
    await db.dropCollection('regions');
    await db.dropCollection('locations');
    await db.dropCollection('streets');
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

  const cities = await City.create(
    { name: 'Бишкек' },
    { name: 'Кант' },
    { name: 'Ош' },
    { name: 'Нарын' },
    { name: 'Балыкчы' },
    { name: 'Каракол' },
    { name: 'Талас' },
    { name: 'Чолпон-Ата' },
    { name: 'Кара-Балта' },
    { name: 'Узген' },
  );

  const regions = await Region.create(
    { name: 'Свердловский' },
    { name: 'Первомайский' },
    { name: 'Ленинский' },
    { name: 'Октябрьский' },
    { name: 'Аламудунский' },
    { name: 'Ыссык-Кульский' },
    { name: 'Ысык-Атинский' },
  );

  const directions = await Direction.create({ name: 'Север' }, { name: 'Юг' }, { name: 'Запад' }, { name: 'Восток' });

  await Street.create(
    { name: 'Киевская' },
    { name: 'Ахунбаева' },
    { name: 'Ибраимова' },
    { name: 'Манаса' },
    { name: 'Московская' },
    { name: 'Горького' },
    { name: 'Логвиненко' },
    { name: 'Боконбаева' },
    { name: 'Исанова' },
    { name: 'Тыныстанова' },
    { name: 'Юнусалиева' },
    { name: 'Фучика' },
    { name: 'Медерова' },
    { name: 'Токтогула' },
    { name: 'Жибек-Жолу' },
    { name: 'пр. Манаса' },
    { name: 'Шабдан-Баатыра' },
  );

  const fixtureAddresses = [
    'пр. Чынгыза Айтматова',
    'ул. Асаналиева / ул. Боконбаева',
    'ул. Гагарина',
    'ул. Байтик Баатыра / ул. Токомбаева',
    'ул. Бакаева / ул. Льва Толстого',
    'ул. Киевская / ул. Бейшеналиевой',
  ];

  const fixtureAddressNotes = [
    'ТРЦ "Bishkek Park", поликлиника',
    'супермаркет "Фрунзе"',
    'Ортосайский р/к, БЦ "Колизей"',
    'с. Маевка',
    'кафе "Гренки"',
  ];

  const randElement = <T>(arr: T[]): T => {
    if (!Array.isArray(arr) || arr.length === 0) throw new Error('Значением параметра должен быть непустой массив');
    return arr[Math.floor(Math.random() * arr.length)];
  };

  for (let i = 0; i < 50; i++) {
    await Location.create({
      direction: randElement(directions)._id,
      city: randElement(cities)._id,
      region: randElement(regions)._id,
      address: randElement(fixtureAddresses),
      addressNote: Math.random() > 0.7 ? randElement(fixtureAddressNotes) : null,
    });
  }

  await db.close();
};

void run();

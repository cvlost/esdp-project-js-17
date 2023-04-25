import mongoose, { Types } from 'mongoose';
import config from './config';
import User from './models/Users';
import { randomUUID } from 'crypto';
import City from './models/City';
import Region from './models/Region';
import Direction from './models/Direction';
import Location from './models/Location';
import Street from './models/Street';
import LegalEntity from './models/LegalEntity';
import { BILLBOARD_LIGHTINGS, BILLBOARD_SIZES } from './constants';
import Format from './models/Format';
import Area from './models/Area';

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
    await db.dropCollection('legalentities');
    await db.dropCollection('formats');
    await db.dropCollection('areas');
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

  const streets = await Street.create(
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

  const legalEntities = await LegalEntity.create({ name: 'Шамдагай' }, { name: 'ШамдагайЮридикал' });

  const formats = await Format.create(
    { name: 'V-образный' },
    { name: 'Г-образный' },
    { name: 'П-образный' },
    { name: 'Т-образный' },
    { name: 'Т-образный со смещ.' },
    { name: 'Ф-образный' },
    { name: 'Трехсторонний' },
  );

  const areas = await Area.create(
    { name: 'Чуйская' },
    { name: 'Таласская' },
    { name: 'Нарынская' },
    { name: 'Ошская' },
    { name: 'Баткенская' },
    { name: 'Ыссык-Кульская' },
    { name: 'Джалал-Абадская' },
  );

  const fixtureAddressNotes = [
    'ТРЦ "Bishkek Park", поликлиника',
    'супермаркет "Фрунзе"',
    'Ортосайский р/к, БЦ "Колизей"',
    'с. Маевка',
    'кафе "Гренки"',
  ];

  const randNum = (from: number, to: number) => Math.floor(Math.random() * (to - from + 1) + from);

  const randElement = <T>(arr: T[]): T => {
    if (!Array.isArray(arr) || arr.length === 0) throw new Error('Значением параметра должен быть непустой массив');
    return arr[Math.floor(Math.random() * arr.length)];
  };

  const lightings = BILLBOARD_LIGHTINGS.slice();
  const sizes = BILLBOARD_SIZES.slice();

  for (let i = 0; i < 50; i++) {
    await Location.create({
      area: randElement(areas)._id,
      direction: randElement(directions)._id,
      city: randElement(cities)._id,
      region: randElement(regions)._id,
      street: randElement(streets)._id,
      format: randElement(formats)._id,
      legalEntity: randElement(legalEntities)._id,
      lighting: randElement(lightings),
      size: randElement(sizes),
      price: Types.Decimal128.fromString(randNum(10000, 40000).toString()),
      rent:
        Math.random() > 0.5
          ? null
          : {
              start: new Date(
                `2023-${String(randNum(1, 3)).padStart(2, '0')}-${String(randNum(1, 14)).padStart(
                  2,
                  '0',
                )}T00:00:00.000Z`,
              ),
              end: new Date(
                `2023-${String(randNum(7, 12)).padStart(2, '0')}-${String(randNum(15, 28)).padStart(
                  2,
                  '0',
                )}T00:00:00.000Z`,
              ),
            },
      reserve:
        Math.random() > 0.5
          ? null
          : {
              start: new Date(
                `2024-${String(randNum(1, 6)).padStart(2, '0')}-${String(randNum(1, 14)).padStart(
                  2,
                  '0',
                )}T00:00:00.000Z`,
              ),
              end: new Date(
                `2024-${String(randNum(7, 12)).padStart(2, '0')}-${String(randNum(15, 28)).padStart(
                  2,
                  '0',
                )}T00:00:00.000Z`,
              ),
            },
      placement: Math.random() > 0.5,
      addressNote: Math.random() > 0.7 ? randElement(fixtureAddressNotes) : null,
    });
  }

  await db.close();
};

void run();

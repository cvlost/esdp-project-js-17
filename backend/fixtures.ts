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
import Format from './models/Format';
import Area from './models/Area';
import Lighting from './models/Lighting';
import Size from './models/Size';
import Client from './models/Client';

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
    await db.dropCollection('sizes');
    await db.dropCollection('lightings');
    await db.dropCollection('clients');
    await db.dropCollection('renthistories');
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

  const areas = await Area.create(
    { name: 'Чуйская' },
    { name: 'Таласская' },
    { name: 'Нарынская' },
    { name: 'Ошская' },
    { name: 'Баткенская' },
    { name: 'Ыссык-Кульская' },
    { name: 'Джалал-Абадская' },
  );

  const cities = await City.create(
    { name: 'Бишкек', area: areas[0]._id },
    { name: 'Кант', area: areas[0]._id },
    { name: 'Ош', area: areas[3]._id },
    { name: 'Нарын', area: areas[2]._id },
    { name: 'Балыкчы', area: areas[5]._id },
    { name: 'Каракол', area: areas[5]._id },
    { name: 'Талас', area: areas[1]._id },
    { name: 'Чолпон-Ата', area: areas[5]._id },
    { name: 'Кара-Балта', area: areas[0]._id },
    { name: 'Узген', area: areas[3]._id },
  );

  const regions = await Region.create(
    { name: 'Свердловский', city: cities[0]._id },
    { name: 'Первомайский', city: cities[0]._id },
    { name: 'Ленинский', city: cities[0]._id },
    { name: 'Октябрьский', city: cities[0]._id },
    { name: 'Аламудунский', city: cities[0]._id },
    { name: 'Ыссык-Кульский', city: cities[0]._id },
    { name: 'Ысык-Атинский', city: cities[0]._id },
  );

  const directions = await Direction.create(
    { name: 'Север' },
    { name: 'Юг' },
    { name: 'Запад' },
    { name: 'Восток' },
    { name: 'Северо-Восток' },
    { name: 'Северо-Запад' },
    { name: 'Юго-Восток' },
    { name: 'Юго-Запад' },
  );

  const streets = await Street.create(
    { name: 'Киевская', city: cities[0]._id },
    { name: 'Ахунбаева', city: cities[0]._id },
    { name: 'Ибраимова', city: cities[0]._id },
    { name: 'Манаса', city: cities[0]._id },
    { name: 'Московская', city: cities[0]._id },
    { name: 'Горького', city: cities[0]._id },
    { name: 'Логвиненко', city: cities[0]._id },
    { name: 'Боконбаева', city: cities[0]._id },
    { name: 'Исанова', city: cities[0]._id },
    { name: 'Тыныстанова', city: cities[0]._id },
    { name: 'Юнусалиева', city: cities[0]._id },
    { name: 'Фучика', city: cities[0]._id },
    { name: 'Медерова', city: cities[0]._id },
    { name: 'Токтогула', city: cities[0]._id },
    { name: 'Жибек-Жолу', city: cities[0]._id },
    { name: 'пр. Манаса', city: cities[0]._id },
    { name: 'Шабдан-Баатыра', city: cities[0]._id },
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

  const fixtureAddressNotes = [
    'ТРЦ "Bishkek Park", поликлиника',
    'супермаркет "Фрунзе"',
    'Ортосайский р/к, БЦ "Колизей"',
    'с. Маевка',
    'кафе "Гренки"',
  ];

  const fixtureDescription =
    'Объект расположен на перекрестке улиц, соединяющих западную и центральную часть города, охватывая мини рынок, аптеки, магазины, места общественного питания. ';

  const randNum = (from: number, to: number) => Math.floor(Math.random() * (to - from + 1) + from);

  const randElement = <T>(arr: T[]): T => {
    if (!Array.isArray(arr) || arr.length === 0) throw new Error('Значением параметра должен быть непустой массив');
    return arr[Math.floor(Math.random() * arr.length)];
  };

  const sizes = await Size.create(
    { name: '2,7x5,7' },
    { name: '2x5' },
    { name: '3x12' },
    { name: '3x14,42' },
    { name: '3x16' },
    { name: '3x18' },
    { name: '3x6' },
    { name: '4x10' },
  );

  const lightings = await Lighting.create({ name: 'Внутреннее' }, { name: 'Внешнее' });

  const clients = await Client.create(
    {
      companyName: 'Арбуз',
      companyPhone: '+996551178715',
      companyEmail: 'arbuz@gmail.com',
    },
    {
      companyName: 'Апельсин',
      companyPhone: '+99655117852',
      companyEmail: 'orange@gmail.com',
    },
    {
      companyName: 'Ананас',
      companyPhone: '+996551178715',
      companyEmail: 'arbuz@gmail.com',
    },
    {
      companyName: 'Персик',
      companyPhone: '+99655117852',
      companyEmail: 'orange@gmail.com',
    },
    {
      companyName: 'Груша',
      companyPhone: '+996551178715',
      companyEmail: 'arbuz@gmail.com',
    },
    {
      companyName: 'Картошка',
      companyPhone: '+99655117852',
      companyEmail: 'orange@gmail.com',
    },
    {
      companyName: 'Лук',
      companyPhone: '+996551178715',
      companyEmail: 'arbuz@gmail.com',
    },
    {
      companyName: 'Огурец',
      companyPhone: '+99655117852',
      companyEmail: 'orange@gmail.com',
    },
    {
      companyName: 'Ананас',
      companyPhone: '+99655117852',
      companyEmail: 'orange@gmail.com',
    },
  );

  const createOneLocation = async (i: number, month = 'май') => {
    return await Location.create({
      area: randElement(areas)._id,
      client: randElement(clients)._id,
      direction: randElement(directions)._id,
      city: randElement(cities)._id,
      region: randElement(regions)._id,
      streets: [randElement(streets)._id, randElement(streets)._id],
      format: randElement(formats)._id,
      legalEntity: randElement(legalEntities)._id,
      lighting: randElement(lightings)._id,
      size: randElement(sizes)._id,
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
      description: Math.random() > 0.5 ? fixtureDescription : null,
      dayImage: `fixtures/${i + 1}.jpg`,
      schemaImage: `fixtures/${i + 1}.png`,
      status: null,
      booking: [],
      month: month,
      year: 2023,
    });
  };

  const arr = [
    'январь',
    'февраль',
    'март',
    'апрель',
    'май',
    'июнь',
    'июль',
    'август',
    'сентябрь',
    'октябрь',
    'ноябрь',
    'декабрь',
  ];

  for (const month of arr) {
    for (let i = 0; i < 5; i++) {
      await createOneLocation(i, month);
    }
  }

  await db.close();
};
void run();

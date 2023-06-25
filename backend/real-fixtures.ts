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
    { name: 'Айни', city: cities[0]._id },
    { name: 'Киевская', city: cities[0]._id },
    { name: 'Ахунбаева', city: cities[0]._id },
    { name: 'пр. Чынгыза Айтматова', city: cities[0]._id },
    { name: 'Манаса', city: cities[0]._id },
    { name: 'Асаналиева', city: cities[0]._id },
    { name: 'Боконбаева ', city: cities[0]._id },
    { name: 'Гагарина', city: cities[0]._id },
    { name: 'Льва Толстого', city: cities[0]._id },
    { name: 'Московская', city: cities[0]._id },
    { name: 'Тыныбекова', city: cities[0]._id },
    { name: '7 апреля', city: cities[0]._id },
    { name: 'Юнусалиева', city: cities[0]._id },
    { name: 'Бакаева', city: cities[0]._id },
    { name: ' Байтик Баатыра', city: cities[0]._id },
    { name: 'Садырбаева', city: cities[0]._id },
    { name: 'Токомбаева', city: cities[0]._id },
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

  const randElement = <T>(arr: T[]): T => {
    if (!Array.isArray(arr) || arr.length === 0) throw new Error('Значением параметра должен быть непустой массив');
    return arr[Math.floor(Math.random() * arr.length)];
  };
  const randNum = (from: number, to: number) => Math.floor(Math.random() * (to - from + 1) + from);

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

  await Location.create(
    {
      area: areas[0]._id,
      client: randElement(clients)._id,
      direction: directions[7]._id,
      city: cities[0]._id,
      region: regions[2]._id,
      streets: [streets[0]._id, streets[3]._id],
      format: formats[2]._id,
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
      addressNote: 'г. Бишкек, ул. Айни / пр. Чынгыза Айтматова восточная плоскость',
      description:
        'Проспект имени Чынгыза Айтматова - правительственная трасса, которая связывает центральную часть города с его южной частью. В зоне охвата – Кыргызско-Турецкий университет «Манас», БГУ, Политех, супермаркет «Globus». Плотные потоки автомобилей и общественного транспорта, магазины, торговые центры, аптеки и места общественного питания.',
      dayImage: `fixtures/real1(0).jpg`,
      schemaImage: `fixtures/real1(1).png`,
      status: null,
      booking: [],
      month: 'январь',
      year: 2023,
    },
    {
      area: areas[0]._id,
      client: randElement(clients)._id,
      direction: directions[7]._id,
      city: cities[0]._id,
      region: regions[2]._id,
      streets: [streets[0]._id, streets[3]._id],
      format: formats[2]._id,
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
      addressNote: 'г. Бишкек, ул. Айни / пр. Чынгыза Айтматова западная плоскость',
      description:
        'Проспект имени Чынгыза Айтматова - правительственная трасса, которая связывает центральную часть города с его южной частью. В зоне охвата – Кыргызско-Турецкий университет «Манас», БГУ, Политех, супермаркет «Globus». Плотные потоки автомобилей и общественного транспорта, магазины, торговые центры, аптеки и места общественного питания.',
      dayImage: `fixtures/real2(0).jpg`,
      schemaImage: `fixtures/real2(1).png`,
      status: null,
      booking: [],
      month: 'февраль',
      year: 2023,
    },
    {
      area: areas[0]._id,
      client: randElement(clients)._id,
      direction: directions[6]._id,
      city: cities[0]._id,
      region: regions[2]._id,
      streets: [streets[5]._id, streets[6]._id],
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
      addressNote: 'г. Бишкек, ул. Асаналиева / ул. Боконбаева северная плоскость',
      description:
        'Дорога, ведущая в центральную часть города. В зоне охвата Ошский рынок, строительный Баткенский рынок, банкетные залы, аптеки, места общественного питания, магазины. ',
      dayImage: `fixtures/real3(0).jpg`,
      schemaImage: `fixtures/real3(1).png`,
      status: null,
      booking: [],
      month: 'март',
      year: 2023,
    },
    {
      area: areas[0]._id,
      client: randElement(clients)._id,
      direction: directions[6]._id,
      city: cities[0]._id,
      region: regions[2]._id,
      streets: [streets[5]._id, streets[6]._id],
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
      addressNote: 'г. Бишкек, ул. Асаналиева / ул. Боконбаева южная плоскость',
      description:
        'Дорога, ведущая в центральную часть города. В зоне охвата Ошский рынок, строительный Баткенский рынок, банкетные залы, аптеки, места общественного питания, магазины.',
      dayImage: `fixtures/real4(0).jpg`,
      schemaImage: `fixtures/real4(1).png`,
      status: null,
      booking: [],
      month: 'март',
      year: 2023,
    },
    {
      area: areas[0]._id,
      client: randElement(clients)._id,
      direction: directions[7]._id,
      city: cities[0]._id,
      region: regions[2]._id,
      streets: [streets[5]._id, streets[6]._id],
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
      addressNote: 'г. Бишкек, ул. Асаналиева / ул. Боконбаева северная плоскость',
      description:
        'Дорога, ведущая в центральную часть города. В зоне охвата Ошский рынок, строительный Баткенский рынок, банкетные залы, аптеки, места общественного питания, магазины.',
      dayImage: `fixtures/real5(0).jpg`,
      schemaImage: `fixtures/real5(1).png`,
      status: null,
      booking: [],
      month: 'март',
      year: 2023,
    },
    {
      area: areas[0]._id,
      client: randElement(clients)._id,
      direction: directions[7]._id,
      city: cities[0]._id,
      region: regions[2]._id,
      streets: [streets[5]._id, streets[6]._id],
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
      addressNote: 'г. Бишкек, ул. Асаналиева / ул. Боконбаева южная плоскость',
      description:
        'Дорога, ведущая в центральную часть города. В зоне охвата Ошский рынок, строительный Баткенский рынок, банкетные залы, аптеки, места общественного питания, магазины.',
      dayImage: `fixtures/real6(0).jpg`,
      schemaImage: `fixtures/real6(1).png`,
      status: null,
      booking: [],
      month: 'январь',
      year: 2023,
    },
    {
      area: areas[0]._id,
      client: randElement(clients)._id,
      direction: directions[4]._id,
      city: cities[0]._id,
      region: regions[2]._id,
      streets: [streets[5]._id, streets[7]._id],
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
      addressNote: 'г. Бишкек, ул. Асаналиева / ул. Гагарина ',
      description:
        'Объект расположен на перекрестке улиц, соединяющих западную и центральную часть города, охватывая мини рынок, аптеки, магазины, места общественного питания. ',
      dayImage: `fixtures/real7(0).jpg`,
      schemaImage: `fixtures/real7(1).png`,
      status: null,
      booking: [],
      month: 'январь',
      year: 2023,
    },
    {
      area: areas[0]._id,
      client: randElement(clients)._id,
      direction: directions[5]._id,
      city: cities[0]._id,
      region: regions[2]._id,
      streets: [streets[5]._id, streets[7]._id],
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
      addressNote: 'г. Бишкек, ул. Асаналиева /  ул. Гагарина  северная плоскость',
      description:
        'Объект расположен на перекрестке улиц, соединяющих западную и центральную часть города, охватывая мини рынок, аптеки, магазины, места общественного питания.',
      dayImage: `fixtures/real8(0).jpg`,
      schemaImage: `fixtures/real8(1).png`,
      status: null,
      booking: [],
      month: 'март',
      year: 2023,
    },
    {
      area: areas[0]._id,
      client: randElement(clients)._id,
      direction: directions[5]._id,
      city: cities[0]._id,
      region: regions[2]._id,
      streets: [streets[5]._id, streets[7]._id],
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
      addressNote: 'г. Бишкек, ул. Асаналиева / ул. Гагарина  южная плоскость',
      description:
        'Объект расположен на перекрестке улиц, соединяющих западную и центральную часть города, охватывая мини рынок, аптеки, магазины, места общественного питания. ',
      dayImage: `fixtures/real9(0).jpg`,
      schemaImage: `fixtures/real9(1).png`,
      status: null,
      booking: [],
      month: 'февраль',
      year: 2023,
    },
    {
      area: areas[0]._id,
      client: randElement(clients)._id,
      direction: directions[0]._id,
      city: cities[0]._id,
      region: regions[2]._id,
      streets: [streets[5]._id, streets[8]._id],
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
      addressNote: 'г. Бишкек, ул. Асаналиева / ул. Льва Толстого  северная плоскость',
      description:
        'Дорога, ведущая в спальные районы города. В зоне охвата - Ошский рынок, строительный рынок «Баткен», банкетные залы, аптеки, места общественного питания, магазины.',
      dayImage: `fixtures/real10(0).jpg`,
      schemaImage: `fixtures/real10(1).png`,
      status: null,
      booking: [],
      month: 'февраль',
      year: 2023,
    },
    {
      area: areas[0]._id,
      client: randElement(clients)._id,
      direction: directions[0]._id,
      city: cities[0]._id,
      region: regions[2]._id,
      streets: [streets[5]._id, streets[8]._id],
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
      addressNote: 'г. Бишкек, ул. Асаналиева / ул. Льва Толстого  южная плоскость',
      description:
        'Дорога, ведущая в центральную часть города. В зоне охвата - Ошский рынок, строительный рынок «Баткен», банкетные залы, аптеки, места общественного питания, магазины.',
      dayImage: `fixtures/real11(0).jpg`,
      schemaImage: `fixtures/real11(1).png`,
      status: null,
      booking: [],
      month: 'февраль',
      year: 2023,
    },
    {
      area: areas[0]._id,
      client: randElement(clients)._id,
      direction: directions[7]._id,
      city: cities[0]._id,
      region: regions[2]._id,
      streets: [streets[5]._id, streets[9]._id],
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
      addressNote: 'г. Бишкек, ул. Асаналиева / ул.  Московская  северная плоскость',
      description:
        'Улица Асаналиева связывает два крупных рынка в северо-западной части города (Ошский и рынок «Баткен»). По ней проходит несколько маршрутов общественного транспорта. Плотный поток автомобилей. Множество точек общественного питания. Аптеки, родильный дом №2.',
      dayImage: `fixtures/real12(0).jpg`,
      schemaImage: `fixtures/real12(1).png`,
      status: null,
      booking: [],
      month: 'февраль',
      year: 2023,
    },
    {
      area: areas[0]._id,
      client: randElement(clients)._id,
      direction: directions[7]._id,
      city: cities[0]._id,
      region: regions[2]._id,
      streets: [streets[5]._id, streets[9]._id],
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
      addressNote: 'г. Бишкек, ул. Асаналиева / ул. Московская , южная плоскость ',
      description:
        'Улица Асаналиева связывает два крупных рынка в северо-западной части города (Ошский и рынок «Баткен»). По ней проходит несколько маршрутов общественного транспорта. Плотный поток автомобилей. Множество точек общественного питания. Аптеки, родильный дом №2.',
      dayImage: `fixtures/real13(0).jpg`,
      schemaImage: `fixtures/real13(1).png`,
      status: null,
      booking: [],
      month: 'февраль',
      year: 2023,
    },
    {
      area: areas[0]._id,
      client: randElement(clients)._id,
      direction: directions[7]._id,
      city: cities[0]._id,
      region: regions[2]._id,
      streets: [streets[5]._id, streets[10]._id],
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
      addressNote: 'г. Бишкек, ул. Асаналиева / ул. Тыныбекова , северная плоскость  ',
      description:
        'Улица, ведущая в микрорайон Джал. Охватывает спальные районы города, магазины, аптеки, места общественного питания.',
      dayImage: `fixtures/real14(0).jpg`,
      schemaImage: `fixtures/real14(1).png`,
      status: null,
      booking: [],
      month: 'февраль',
      year: 2023,
    },
    {
      area: areas[0]._id,
      client: randElement(clients)._id,
      direction: directions[7]._id,
      city: cities[0]._id,
      region: regions[2]._id,
      streets: [streets[2]._id, streets[10]._id],
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
      addressNote: 'г. Бишкек, ул. Асаналиева / ул. Тыныбекова , южная плоскость',
      description:
        'Улица, ведущая в центральную часть города. Охватывает спальные районы города, магазины, аптеки, места общественного питания.',
      dayImage: `fixtures/real15(0).jpg`,
      schemaImage: `fixtures/real15(1).png`,
      status: null,
      booking: [],
      month: 'февраль',
      year: 2023,
    },
    {
      area: areas[0]._id,
      client: randElement(clients)._id,
      direction: directions[4]._id,
      city: cities[0]._id,
      region: regions[2]._id,
      streets: [streets[2]._id, streets[11]._id],
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
      addressNote: 'г. Бишкек, ул. Ахунбаева / ул. 7 апреля восточная плоскость',
      description:
        'Крупный кольцевой перекрёсток в юго-восточной части города. В зоне охвата щита – насыщенные автомобильные потоки, супермаркет «Globus», АЗС, аптеки, магазины, банки, школы, места общественного питания.',
      dayImage: `fixtures/real16(0).jpg`,
      schemaImage: `fixtures/real16(1).png`,
      status: null,
      booking: [],
      month: 'февраль',
      year: 2023,
    },
    {
      area: areas[0]._id,
      client: randElement(clients)._id,
      direction: directions[4]._id,
      city: cities[0]._id,
      region: regions[2]._id,
      streets: [streets[2]._id, streets[11]._id],
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
      addressNote: 'г. Бишкек, ул. Ахунбаева / ул. 7 апреля (супермаркет «Globus»), западная плоскость',
      description:
        'Крупный кольцевой перекрёсток в юго-восточной части города. В зоне охвата щита – насыщенные автомобильные потоки, супермаркет «Globus», АЗС, аптеки, магазины, банки, школы, места общественного питания.',
      dayImage: `fixtures/real17(0).jpg`,
      schemaImage: `fixtures/real17(1).png`,
      status: null,
      booking: [],
      month: 'март',
      year: 2023,
    },
    {
      area: areas[0]._id,
      client: randElement(clients)._id,
      direction: directions[7]._id,
      city: cities[0]._id,
      region: regions[2]._id,
      streets: [streets[2]._id, streets[15]._id],
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
      addressNote: 'г. Бишкек, ул. Ахунбаева / ул. Садырбаева, супермаркет "Фрунзе" , восточная плоскость',
      description:
        'Крупный перекрёсток в западной части города. Дорога, ведущая в новые жилые массивы. В зоне охвата щита – насыщенные автомобильные потоки, крупный супермаркет «Фрунзе», аптеки, места общественного питания.',
      dayImage: `fixtures/real18(0).jpg`,
      schemaImage: `fixtures/real18(1).png`,
      status: null,
      booking: [],
      month: 'март',
      year: 2023,
    },
    {
      area: areas[0]._id,
      client: randElement(clients)._id,
      direction: directions[7]._id,
      city: cities[0]._id,
      region: regions[2]._id,
      streets: [streets[2]._id, streets[15]._id],
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
      addressNote: 'г. Бишкек, ул. Ахунбаева / ул. Садырбаева, супермаркет "Фрунзе"  западная плоскость',
      description:
        'Крупный перекрёсток в западной части города. Дорога, ведущая в новые жилые массивы. В зоне охвата щита – насыщенные автомобильные потоки, крупный супермаркет «Фрунзе», аптеки, места общественного питания.',
      dayImage: `fixtures/real19(0).jpg`,
      schemaImage: `fixtures/real19(1).png`,
      status: null,
      booking: [],
      month: 'март',
      year: 2023,
    },
    {
      area: areas[0]._id,
      client: randElement(clients)._id,
      direction: directions[4]._id,
      city: cities[0]._id,
      region: regions[3]._id,
      streets: [streets[17]._id, streets[16]._id],
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
      addressNote: 'г. Бишкек, ул. Байтик Баатыра / ул. Токомбаева (северо-восток), северная плоскость',
      description:
        'Улица Байтик Баатыра - крупная магистраль города, она связывает центральную часть города с его южной частью. Плотные автомобильные потоки, супермаркеты, аптеки, бизнес-среда.',
      dayImage: `fixtures/real20(0).jpg`,
      schemaImage: `fixtures/real20(1).png`,
      status: null,
      booking: [],
      month: 'март',
      year: 2023,
    },
  );

  await db.close();
};
void run();

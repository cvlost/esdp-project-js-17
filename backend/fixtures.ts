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
import dayjs from 'dayjs';
import ru from 'dayjs/locale/ru';

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

    const collectionNames = ['renthistories', 'notifications', 'commerciallinks', 'bookings'];

    for (const collectionName of collectionNames) {
      const collectionExists = (await db.collection(collectionName).countDocuments()) !== 0;

      if (collectionExists) {
        await db.dropCollection(collectionName);
      }
    }
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

  for (let i = 0; i <= 20; i++) {
    if (i >= 15) {
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
      companyName: 'Global',
      companyPhone: '+99655117852',
      companyEmail: 'global@gmail.com',
    },
    {
      companyName: 'Jenkins',
      companyPhone: '+996551178715',
      companyEmail: 'jenkins@gmail.com',
    },
    {
      companyName: 'AdvertGroup',
      companyPhone: '+99655117852',
      companyEmail: 'adv@gmail.com',
    },
    {
      companyName: 'Блитц',
      companyPhone: '+996551178715',
      companyEmail: 'blitz@gmail.com',
    },
    {
      companyName: 'Аттрактор',
      companyPhone: '+99655117852',
      companyEmail: 'attractor@gmail.com',
    },
    {
      companyName: 'Бронкинс',
      companyPhone: '+996551178715',
      companyEmail: 'bron@gmail.com',
    },
    {
      companyName: 'Aqua',
      companyPhone: '+99655117852',
      companyEmail: 'aqua@gmail.com',
    },
    {
      companyName: 'Fusion',
      companyPhone: '+99655117852',
      companyEmail: 'fusion@gmail.com',
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
      rent: null,
      placement: Math.random() > 0.5,
      addressNote: 'г. Бишкек, ул. Айни / пр. Чынгыза Айтматова восточная плоскость',
      description:
        'Проспект имени Чынгыза Айтматова - правительственная трасса, которая связывает центральную часть города с его южной частью. В зоне охвата – Кыргызско-Турецкий университет «Манас», БГУ, Политех, супермаркет «Globus». Плотные потоки автомобилей и общественного транспорта, магазины, торговые центры, аптеки и места общественного питания.',
      dayImage: `fixtures/1.jpg`,
      schemaImage: `fixtures/1s.png`,
      status: null,
      booking: [],
      month: dayjs().locale(ru).format('MMMM'),
      year: dayjs().year(),
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
      rent: null,
      placement: Math.random() > 0.5,
      addressNote: 'г. Бишкек, ул. Айни / пр. Чынгыза Айтматова западная плоскость',
      description:
        'Проспект имени Чынгыза Айтматова - правительственная трасса, которая связывает центральную часть города с его южной частью. В зоне охвата – Кыргызско-Турецкий университет «Манас», БГУ, Политех, супермаркет «Globus». Плотные потоки автомобилей и общественного транспорта, магазины, торговые центры, аптеки и места общественного питания.',
      dayImage: `fixtures/2.jpg`,
      schemaImage: `fixtures/2s.png`,
      status: null,
      booking: [],
      month: dayjs().locale(ru).format('MMMM'),
      year: dayjs().year(),
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
      rent: null,
      placement: Math.random() > 0.5,
      addressNote: 'г. Бишкек, ул. Асаналиева / ул. Боконбаева северная плоскость',
      description:
        'Дорога, ведущая в центральную часть города. В зоне охвата Ошский рынок, строительный Баткенский рынок, банкетные залы, аптеки, места общественного питания, магазины. ',
      dayImage: `fixtures/3.jpg`,
      schemaImage: `fixtures/3s.png`,
      status: null,
      booking: [],
      month: dayjs().locale(ru).format('MMMM'),
      year: dayjs().year(),
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
      rent: null,
      placement: Math.random() > 0.5,
      addressNote: 'г. Бишкек, ул. Асаналиева / ул. Боконбаева южная плоскость',
      description:
        'Дорога, ведущая в центральную часть города. В зоне охвата Ошский рынок, строительный Баткенский рынок, банкетные залы, аптеки, места общественного питания, магазины.',
      dayImage: `fixtures/4.jpg`,
      schemaImage: `fixtures/4s.png`,
      status: null,
      booking: [],
      month: dayjs().locale(ru).format('MMMM'),
      year: dayjs().year(),
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
      rent: null,
      placement: Math.random() > 0.5,
      addressNote: 'г. Бишкек, ул. Асаналиева / ул. Боконбаева северная плоскость',
      description:
        'Дорога, ведущая в центральную часть города. В зоне охвата Ошский рынок, строительный Баткенский рынок, банкетные залы, аптеки, места общественного питания, магазины.',
      dayImage: `fixtures/5.jpg`,
      schemaImage: `fixtures/5s.png`,
      status: null,
      booking: [],
      month: dayjs().locale(ru).format('MMMM'),
      year: dayjs().year(),
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
      rent: null,
      placement: Math.random() > 0.5,
      addressNote: 'г. Бишкек, ул. Асаналиева / ул. Боконбаева южная плоскость',
      description:
        'Дорога, ведущая в центральную часть города. В зоне охвата Ошский рынок, строительный Баткенский рынок, банкетные залы, аптеки, места общественного питания, магазины.',
      dayImage: `fixtures/6.jpg`,
      schemaImage: `fixtures/6s.png`,
      status: null,
      booking: [],
      month: dayjs().locale(ru).format('MMMM'),
      year: dayjs().year(),
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
      rent: null,
      placement: Math.random() > 0.5,
      addressNote: 'г. Бишкек, ул. Асаналиева / ул. Гагарина ',
      description:
        'Объект расположен на перекрестке улиц, соединяющих западную и центральную часть города, охватывая мини рынок, аптеки, магазины, места общественного питания. ',
      dayImage: `fixtures/7.jpg`,
      schemaImage: `fixtures/7s.png`,
      status: null,
      booking: [],
      month: dayjs().locale(ru).format('MMMM'),
      year: dayjs().year(),
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
      rent: null,
      placement: Math.random() > 0.5,
      addressNote: 'г. Бишкек, ул. Асаналиева /  ул. Гагарина  северная плоскость',
      description:
        'Объект расположен на перекрестке улиц, соединяющих западную и центральную часть города, охватывая мини рынок, аптеки, магазины, места общественного питания.',
      dayImage: `fixtures/8.jpg`,
      schemaImage: `fixtures/8s.png`,
      status: null,
      booking: [],
      month: dayjs().locale(ru).format('MMMM'),
      year: dayjs().year(),
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
      rent: null,
      placement: Math.random() > 0.5,
      addressNote: 'г. Бишкек, ул. Асаналиева / ул. Гагарина  южная плоскость',
      description:
        'Объект расположен на перекрестке улиц, соединяющих западную и центральную часть города, охватывая мини рынок, аптеки, магазины, места общественного питания. ',
      dayImage: `fixtures/9.jpg`,
      schemaImage: `fixtures/9s.png`,
      status: null,
      booking: [],
      month: dayjs().locale(ru).format('MMMM'),
      year: dayjs().year(),
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
      rent: null,
      placement: Math.random() > 0.5,
      addressNote: 'г. Бишкек, ул. Асаналиева / ул. Льва Толстого  северная плоскость',
      description:
        'Дорога, ведущая в спальные районы города. В зоне охвата - Ошский рынок, строительный рынок «Баткен», банкетные залы, аптеки, места общественного питания, магазины.',
      dayImage: `fixtures/10.jpg`,
      schemaImage: `fixtures/10s.png`,
      status: null,
      booking: [],
      month: dayjs().locale(ru).format('MMMM'),
      year: dayjs().year(),
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
      rent: null,
      placement: Math.random() > 0.5,
      addressNote: 'г. Бишкек, ул. Асаналиева / ул. Льва Толстого  южная плоскость',
      description:
        'Дорога, ведущая в центральную часть города. В зоне охвата - Ошский рынок, строительный рынок «Баткен», банкетные залы, аптеки, места общественного питания, магазины.',
      dayImage: `fixtures/11.jpg`,
      schemaImage: `fixtures/11s.png`,
      status: null,
      booking: [],
      month: dayjs().locale(ru).format('MMMM'),
      year: dayjs().year(),
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
      rent: null,
      placement: Math.random() > 0.5,
      addressNote: 'г. Бишкек, ул. Асаналиева / ул.  Московская  северная плоскость',
      description:
        'Улица Асаналиева связывает два крупных рынка в северо-западной части города (Ошский и рынок «Баткен»). По ней проходит несколько маршрутов общественного транспорта. Плотный поток автомобилей. Множество точек общественного питания. Аптеки, родильный дом №2.',
      dayImage: `fixtures/12.jpg`,
      schemaImage: `fixtures/12s.png`,
      status: null,
      booking: [],
      month: dayjs().locale(ru).format('MMMM'),
      year: dayjs().year(),
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
      rent: null,
      placement: Math.random() > 0.5,
      addressNote: 'г. Бишкек, ул. Асаналиева / ул. Московская , южная плоскость ',
      description:
        'Улица Асаналиева связывает два крупных рынка в северо-западной части города (Ошский и рынок «Баткен»). По ней проходит несколько маршрутов общественного транспорта. Плотный поток автомобилей. Множество точек общественного питания. Аптеки, родильный дом №2.',
      dayImage: `fixtures/13.jpg`,
      schemaImage: `fixtures/13s.png`,
      status: null,
      booking: [],
      month: dayjs().locale(ru).format('MMMM'),
      year: dayjs().year(),
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
      rent: null,
      placement: Math.random() > 0.5,
      addressNote: 'г. Бишкек, ул. Асаналиева / ул. Тыныбекова , северная плоскость  ',
      description:
        'Улица, ведущая в микрорайон Джал. Охватывает спальные районы города, магазины, аптеки, места общественного питания.',
      dayImage: `fixtures/14.jpg`,
      schemaImage: `fixtures/14s.png`,
      status: null,
      booking: [],
      month: dayjs().locale(ru).format('MMMM'),
      year: dayjs().year(),
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
      rent: null,
      placement: Math.random() > 0.5,
      addressNote: 'г. Бишкек, ул. Асаналиева / ул. Тыныбекова , южная плоскость',
      description:
        'Улица, ведущая в центральную часть города. Охватывает спальные районы города, магазины, аптеки, места общественного питания.',
      dayImage: `fixtures/15.jpg`,
      schemaImage: `fixtures/15s.png`,
      status: null,
      booking: [],
      month: dayjs().locale(ru).format('MMMM'),
      year: dayjs().year(),
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
      rent: null,
      placement: Math.random() > 0.5,
      addressNote: 'г. Бишкек, ул. Ахунбаева / ул. 7 апреля восточная плоскость',
      description:
        'Крупный кольцевой перекрёсток в юго-восточной части города. В зоне охвата щита – насыщенные автомобильные потоки, супермаркет «Globus», АЗС, аптеки, магазины, банки, школы, места общественного питания.',
      dayImage: `fixtures/16.jpg`,
      schemaImage: `fixtures/16s.png`,
      status: null,
      booking: [],
      month: dayjs().locale(ru).format('MMMM'),
      year: dayjs().year(),
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
      rent: null,
      placement: Math.random() > 0.5,
      addressNote: 'г. Бишкек, ул. Ахунбаева / ул. 7 апреля (супермаркет «Globus»), западная плоскость',
      description:
        'Крупный кольцевой перекрёсток в юго-восточной части города. В зоне охвата щита – насыщенные автомобильные потоки, супермаркет «Globus», АЗС, аптеки, магазины, банки, школы, места общественного питания.',
      dayImage: `fixtures/17.jpg`,
      schemaImage: `fixtures/17s.png`,
      status: null,
      booking: [],
      month: dayjs().locale(ru).format('MMMM'),
      year: dayjs().year(),
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
      rent: null,
      placement: Math.random() > 0.5,
      addressNote: 'г. Бишкек, ул. Ахунбаева / ул. Садырбаева, супермаркет "Фрунзе" , восточная плоскость',
      description:
        'Крупный перекрёсток в западной части города. Дорога, ведущая в новые жилые массивы. В зоне охвата щита – насыщенные автомобильные потоки, крупный супермаркет «Фрунзе», аптеки, места общественного питания.',
      dayImage: `fixtures/18.jpg`,
      schemaImage: `fixtures/18s.png`,
      status: null,
      booking: [],
      month: dayjs().locale(ru).format('MMMM'),
      year: dayjs().year(),
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
      rent: null,
      placement: Math.random() > 0.5,
      addressNote: 'г. Бишкек, ул. Ахунбаева / ул. Садырбаева, супермаркет "Фрунзе"  западная плоскость',
      description:
        'Крупный перекрёсток в западной части города. Дорога, ведущая в новые жилые массивы. В зоне охвата щита – насыщенные автомобильные потоки, крупный супермаркет «Фрунзе», аптеки, места общественного питания.',
      dayImage: `fixtures/19.jpg`,
      schemaImage: `fixtures/19s.png`,
      status: null,
      booking: [],
      month: dayjs().locale(ru).format('MMMM'),
      year: dayjs().year(),
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
      rent: null,
      placement: Math.random() > 0.5,
      addressNote: 'г. Бишкек, ул. Байтик Баатыра / ул. Токомбаева (северо-восток), северная плоскость',
      description:
        'Улица Байтик Баатыра - крупная магистраль города, она связывает центральную часть города с его южной частью. Плотные автомобильные потоки, супермаркеты, аптеки, бизнес-среда.',
      dayImage: `fixtures/20.jpg`,
      schemaImage: `fixtures/20s.png`,
      status: null,
      booking: [],
      month: dayjs().locale(ru).format('MMMM'),
      year: dayjs().year(),
    },
  );

  await db.close();
};
void run();

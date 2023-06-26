import mongoose, { HydratedDocument, Types } from 'mongoose';
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
import { ILocation, IPeriod } from './types';
import dayjs from 'dayjs';
import RentHistory from './models/RentHistory';
import Booking from './models/Booking';

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
    await db.dropCollection('bookings');
    await db.dropCollection('notifications');
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

  const locations: HydratedDocument<ILocation>[] = [];

  for (const month of arr) {
    for (let i = 0; i < 5; i++) {
      const loc = await Location.create({
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

      locations.push(loc);
    }
  }

  const setRentAndHistoryFor = async (loc: HydratedDocument<ILocation>, start: Date, end: Date) => {
    loc.rent = { start, end };
    await loc.save();

    await RentHistory.create({
      client: randElement(clients)._id,
      location: loc._id,
      rent_price: loc.price,
      rent_cost: Types.Decimal128.fromString(randNum(10000, 40000).toString()),
      rent_date: { start, end },
    });
  };

  const setBookingFor = async (loc: HydratedDocument<ILocation>, ...periods: IPeriod[]) => {
    const ids: Types.ObjectId[] = [];
    for (const booking_date of periods) {
      const newBooking = await Booking.create({
        clientId: randElement(clients)._id,
        locationId: loc._id,
        booking_date,
      });

      ids.push(newBooking._id);
    }

    await Location.updateOne({ _id: loc._id }, { $push: { booking: { $each: ids } } });
  };

  await Promise.all([
    setRentAndHistoryFor(locations[0], dayjs().subtract(60, 'days').toDate(), dayjs().subtract(1, 'days').toDate()),
    setRentAndHistoryFor(locations[1], dayjs().subtract(60, 'days').toDate(), dayjs().add(5, 'days').toDate()),
    setRentAndHistoryFor(locations[2], dayjs().subtract(90, 'days').toDate(), dayjs().add(7, 'days').toDate()),
    setRentAndHistoryFor(locations[3], dayjs().subtract(100, 'days').toDate(), dayjs().add(200, 'days').toDate()),
    setRentAndHistoryFor(locations[4], dayjs().subtract(55, 'days').toDate(), dayjs().add(40, 'days').toDate()),
    setRentAndHistoryFor(locations[5], dayjs().subtract(150, 'days').toDate(), dayjs().subtract(1, 'days').toDate()),
  ]);

  await Promise.all([
    setBookingFor(
      locations[0],
      { start: dayjs().add(1, 'days').toDate(), end: dayjs().add(100, 'days').toDate() },
      { start: dayjs().add(110, 'days').toDate(), end: dayjs().add(200, 'days').toDate() },
      { start: dayjs().add(210, 'days').toDate(), end: dayjs().add(300, 'days').toDate() },
    ),
    setBookingFor(
      locations[1],
      { start: dayjs().add(210, 'days').toDate(), end: dayjs().add(300, 'days').toDate() },
      { start: dayjs().add(110, 'days').toDate(), end: dayjs().add(200, 'days').toDate() },
      { start: dayjs().add(2, 'days').toDate(), end: dayjs().add(100, 'days').toDate() },
    ),
    setBookingFor(locations[2], { start: dayjs().add(3, 'days').toDate(), end: dayjs().add(100, 'days').toDate() }),
    setBookingFor(locations[3], { start: dayjs().add(4, 'days').toDate(), end: dayjs().add(100, 'days').toDate() }),
    setBookingFor(
      locations[4],
      { start: dayjs().add(10, 'days').toDate(), end: dayjs().add(100, 'days').toDate() },
      { start: dayjs().add(110, 'days').toDate(), end: dayjs().add(200, 'days').toDate() },
    ),
  ]);

  await db.close();
};
void run();

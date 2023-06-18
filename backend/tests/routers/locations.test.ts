import app from '../app';
import supertest from 'supertest';
import { randomUUID } from 'crypto';
import * as db from '../db';
import User from '../../models/Users';
import Size from '../../models/Size';
import Location from '../../models/Location';
import mongoose, { FilterQuery, HydratedDocument, Types } from 'mongoose';
import Area from '../../models/Area';
import LegalEntity from '../../models/LegalEntity';
import Format from '../../models/Format';
import City from '../../models/City';
import Direction from '../../models/Direction';
import Region from '../../models/Region';
import Street from '../../models/Street';
import Lighting from '../../models/Lighting';
import locationsRouter, { flattenLookup } from '../../routers/locations';
import { ILocation } from '../../types';
import Client from '../../models/Client';
import RentHistory from '../../models/RentHistory';

export interface BookingListType {
  _id: string;
  clientId: string;
  locationId: string;
  booking_date: {
    start: string;
    end: string;
  };
}

interface IPeriod {
  start: string;
  end: string;
}

interface IFrontendLocation {
  _id: string;
  price: string;
  rent: null | IPeriod;
  city: string;
  area: string;
  streets: [string, string] | string[];
  direction: string;
  region: string;
  legalEntity: string;
  size: string;
  lighting: string;
  format: string;
  placement: boolean;
  country?: string;
  dayImage?: string;
  schemaImage?: string;
  addressNote?: string;
  description?: string;
  checked: boolean;
  status: string | null;
  booking: BookingListType[];
}

interface WithNameAndId {
  name: string;
  _id: string;
}

interface GetItemsResponse {
  areas: WithNameAndId[];
  cities: (WithNameAndId & { area: string })[];
  formats: WithNameAndId[];
  regions: (WithNameAndId & { city: string })[];
  directions: WithNameAndId[];
  lightings: WithNameAndId[];
  legalEntities: WithNameAndId[];
  sizes: WithNameAndId[];
}

interface IPeriod {
  start: string;
  end: string;
}

interface IRentUpdateDto {
  client: string;
  date: IPeriod;
  price: string;
}

app.use('/locations', locationsRouter);
const request = supertest(app);

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

const createLocationDto = async () => {
  const count = await Location.count();
  const area = await Area.create({ name: `area${count}` });
  const city = await City.create({ name: `city${count}`, area: area._id });
  const region = await Region.create({ name: `region${count}`, city: city._id });
  const direction = await Direction.create({ name: `direction${count}` });
  const format = await Format.create({ name: `format${count}` });
  const legalEntity = await LegalEntity.create({ name: `legalEntity${count}` });
  const lighting = await Lighting.create({ name: `lighting${count}` });
  const size = await Size.create({ name: `${count}x${count}` });
  const placement = Math.random() > 0.5;
  const [street1, street2] = await Street.create(
    { name: 'street1', city: city._id },
    { name: 'street2', city: city._id },
  );

  return {
    area: area._id.toString(),
    city: city._id.toString(),
    region: region._id.toString(),
    format: format._id.toString(),
    direction: direction._id.toString(),
    lighting: lighting._id.toString(),
    legalEntity: legalEntity._id.toString(),
    size: size._id.toString(),
    street1: street1._id.toString(),
    street2: street2._id.toString(),
    price: '5000',
    placement,
  };
};

export const createOneLocation = async () => {
  const count = await Location.count();
  const area = await Area.create({ name: `area${count}` });
  const city = await City.create({ name: `city${count}`, area: area._id });
  const region = await Region.create({ name: `region${count}`, city: city._id });
  const format = await Format.create({ name: `format${count}` });
  const direction = await Direction.create({ name: `direction${count}` });
  const lighting = await Lighting.create({ name: `lighting${count}` });
  const legalEntity = await LegalEntity.create({ name: `legalEntity${count}` });
  const size = await Size.create({ name: `${count}x${count}` });
  const placement = Math.random() > 0.5;
  const rent =
    Math.random() > 0.5
      ? null
      : {
          start: new Date('2023-02-30T09:38:01.595Z'),
          end: new Date('2023-10-30T09:38:01.595Z'),
        };
  const [street1, street2] = await Street.create(
    { name: 'street1', city: city._id },
    { name: 'street2', city: city._id },
  );
  return await Location.create({
    legalEntity: legalEntity._id,
    format: format._id,
    direction: direction._id,
    lighting: lighting._id,
    region: region._id,
    size: size._id,
    area: area._id,
    city: city._id,
    streets: [street1._id, street2._id],
    price: mongoose.Types.Decimal128.fromString(`${1}000`),
    placement,
    rent,
    dayImage: `some/path${1}`,
    schemaImage: `some/path${1}`,
  });
};

const addLocation = async (number: number) => {
  const locations: HydratedDocument<ILocation>[] = [];

  for (let i = 0; i < number; i++) {
    const location = await createOneLocation();

    locations.push(location);
  }

  return locations;
};

describe('locationsRouter', () => {
  beforeAll(async () => {
    await db.connect();
  });

  beforeEach(async () => {
    await db.clear();
    await User.create(adminDto, userDto);
  });

  afterAll(async () => {
    await db.disconnect();
  });

  describe('POST /locations', () => {
    describe('любой пользователь пытается получить список', () => {
      test('без query параметвов, должен возвращать statusCode 200 и данные для пагинации', async () => {
        const locationsNumber = 30;
        const expectedPage = 1;
        const expectedPerPage = 10;
        const expectedPages = 3;
        await addLocation(locationsNumber);
        const createdLocations = await Location.aggregate([
          { $limit: expectedPerPage },
          { $sort: { _id: -1 } },
          ...flattenLookup,
          { $project: { country: 0, description: 0 } },
        ]);
        const expectedLocationsList = createdLocations.map((location) => ({
          ...location,
          _id: location._id.toString(),
          rent: location.rent
            ? { start: location.rent.start.toISOString(), end: location.rent.end.toISOString() }
            : null,
        }));
        const res = await request.post(`/locations`);
        const locationsListData = res.body;

        expect(res.statusCode).toBe(200);
        expect(locationsListData.locations).toEqual(expectedLocationsList);
        expect(locationsListData.locations.length).toEqual(expectedPerPage);
        expect(locationsListData.filtered).toBe(false);
        expect(locationsListData.page).toBe(expectedPage);
        expect(locationsListData.pages).toBe(expectedPages);
        expect(locationsListData.count).toBe(locationsNumber);
        expect(locationsListData.perPage).toBe(expectedPerPage);
      });

      test('с отличными от дефолтных query параметрами, должен возвращать statusCode 200 и данные для пагинации', async () => {
        const locationsNumber = 30;
        const expectedPage = 2;
        const expectedPerPage = 15;
        const expectedPages = Math.ceil(locationsNumber / expectedPerPage);
        await addLocation(locationsNumber);
        const createdLocations = await Location.aggregate([
          { $skip: (expectedPage - 1) * expectedPerPage },
          { $limit: expectedPerPage },
          { $sort: { _id: -1 } },
          ...flattenLookup,
          { $project: { country: 0, description: 0 } },
        ]);
        const expectedLocationsList = createdLocations.map((location) => ({
          ...location,
          _id: location._id.toString(),
          rent: location.rent
            ? { start: location.rent.start.toISOString(), end: location.rent.end.toISOString() }
            : null,
        }));
        const res = await request.post(`/locations?page=${expectedPage}&perPage=${expectedPerPage}`);
        const locationsListData = res.body;

        expect(res.statusCode).toBe(200);
        expect(locationsListData.locations).toEqual(expectedLocationsList);
        expect(locationsListData.locations.length).toEqual(expectedPerPage);
        expect(locationsListData.page).toBe(expectedPage);
        expect(locationsListData.filtered).toBe(false);
        expect(locationsListData.pages).toBe(expectedPages);
        expect(locationsListData.perPage).toBe(expectedPerPage);
        expect(locationsListData.count).toBe(locationsNumber);
      });

      test('с невалидными query параметрами и большим значением номера страницы, должен возвращать statusCode 200 и данные для пагинации', async () => {
        const locationsNumber = 30;
        const expectedPage = 3;
        const expectedPerPage = 10;
        const expectedPages = 3;
        await addLocation(locationsNumber);
        const createdLocations = await Location.aggregate([
          { $skip: (expectedPage - 1) * expectedPerPage },
          { $limit: expectedPerPage },
          { $sort: { _id: -1 } },
          ...flattenLookup,
          { $project: { country: 0, description: 0 } },
        ]);
        const expectedLocationsList = createdLocations.map((location) => ({
          ...location,
          _id: location._id.toString(),
          rent: location.rent
            ? { start: location.rent.start.toISOString(), end: location.rent.end.toISOString() }
            : null,
        }));
        const res = await request.post(`/locations?page=1000000f&perPage=asdfasdf`);
        const locationsListData = res.body;

        expect(res.statusCode).toBe(200);
        expect(locationsListData.locations).toEqual(expectedLocationsList);
        expect(locationsListData.locations.length).toEqual(expectedPerPage);
        expect(locationsListData.page).toBe(expectedPage);
        expect(locationsListData.filtered).toBe(false);
        expect(locationsListData.pages).toBe(expectedPages);
        expect(locationsListData.perPage).toBe(expectedPerPage);
        expect(locationsListData.count).toBe(locationsNumber);
      });

      describe('указав критерии в фильтре, дожен получать корректные данные', () => {
        const locationsNumber = 20;

        test('фильтрация по областям', async () => {
          const [loc1, loc2] = await addLocation(locationsNumber);
          const areaIds = [loc1.area.toString(), loc2.area.toString()];
          const filterQuery: FilterQuery<ILocation> = { $and: [{ area: { $in: areaIds } }] };
          const filteredCount = await Location.find(filterQuery).count();
          const expectedAreaNames = (await Area.find({ _id: { $in: areaIds } })).map((area) => area.name).sort();
          const res = await request.post(`/locations`).send({ filterQuery });
          const locationsListData = res.body;
          const locationsList = locationsListData.locations as IFrontendLocation[];
          const receivedAreaNames = locationsList.map((loc) => loc.area).sort();

          expect(res.statusCode).toBe(200);
          expect(locationsList.length).toBe(2);
          expect(receivedAreaNames).toEqual(expectedAreaNames);
          expect(locationsListData.filtered).toBe(true);
          expect(locationsListData.count).toBe(filteredCount);
        });

        test('фильтрация по городам', async () => {
          const [loc1, loc2] = await addLocation(locationsNumber);
          const cityIds = [loc1.city.toString(), loc2.city.toString()];
          const filterQuery: FilterQuery<ILocation> = { $and: [{ city: { $in: cityIds } }] };
          const filteredCount = await Location.find(filterQuery).count();
          const expectedNames = (await City.find({ _id: { $in: cityIds } })).map((city) => city.name).sort();
          const res = await request.post(`/locations`).send({ filterQuery });
          const locationsListData = res.body;
          const locationsList = locationsListData.locations as IFrontendLocation[];
          const receivedNames = locationsList.map((loc) => loc.city).sort();

          expect(res.statusCode).toBe(200);
          expect(locationsList.length).toBe(2);
          expect(receivedNames).toEqual(expectedNames);
          expect(locationsListData.filtered).toBe(true);
          expect(locationsListData.count).toBe(filteredCount);
        });

        test('фильтрация по районам', async () => {
          const [loc1, loc2] = await addLocation(locationsNumber);
          const regionIds = [loc1.region.toString(), loc2.region.toString()];
          const filterQuery: FilterQuery<ILocation> = { $and: [{ region: { $in: regionIds } }] };
          const filteredCount = await Location.find(filterQuery).count();
          const expectedNames = (await Region.find({ _id: { $in: regionIds } })).map((region) => region.name).sort();
          const res = await request.post(`/locations`).send({ filterQuery });
          const locationsListData = res.body;
          const locationsList = locationsListData.locations as IFrontendLocation[];
          const receivedNames = locationsList.map((loc) => loc.region).sort();

          expect(res.statusCode).toBe(200);
          expect(locationsList.length).toBe(2);
          expect(receivedNames).toEqual(expectedNames);
          expect(locationsListData.filtered).toBe(true);
          expect(locationsListData.count).toBe(filteredCount);
        });

        test('фильтрация по улицам', async () => {
          const [loc1, loc2] = await addLocation(locationsNumber);
          const streetsIds = [loc1.streets[0].toString(), loc2.streets[0].toString()];
          const filterQuery: FilterQuery<ILocation> = { $and: [{ streets: { $in: streetsIds } }] };
          const filteredCount = await Location.find(filterQuery).count();
          const expectedNames = (await Street.find({ _id: { $in: streetsIds } })).map((streets) => streets.name).sort();
          const res = await request.post(`/locations`).send({ filterQuery });
          const locationsListData = res.body;
          const locationsList = locationsListData.locations as IFrontendLocation[];
          const receivedNames = locationsList.map((loc) => loc.streets[0]).sort();

          expect(res.statusCode).toBe(200);
          expect(locationsList.length).toBe(2);
          expect(receivedNames).toEqual(expectedNames);
          expect(locationsListData.filtered).toBe(true);
          expect(locationsListData.count).toBe(filteredCount);
        });

        test('фильтрация по направлениям', async () => {
          const [loc1, loc2] = await addLocation(locationsNumber);
          const directionIds = [loc1.direction.toString(), loc2.direction.toString()];
          const filterQuery: FilterQuery<ILocation> = { $and: [{ direction: { $in: directionIds } }] };
          const filteredCount = await Location.find(filterQuery).count();
          const expectedNames = (await Direction.find({ _id: { $in: directionIds } }))
            .map((direction) => direction.name)
            .sort();
          const res = await request.post(`/locations`).send({ filterQuery });
          const locationsListData = res.body;
          const locationsList = locationsListData.locations as IFrontendLocation[];
          const receivedNames = locationsList.map((loc) => loc.direction).sort();

          expect(res.statusCode).toBe(200);
          expect(locationsList.length).toBe(2);
          expect(receivedNames).toEqual(expectedNames);
          expect(locationsListData.filtered).toBe(true);
          expect(locationsListData.count).toBe(filteredCount);
        });

        test('фильтрация по юр. лицам', async () => {
          const [loc1, loc2] = await addLocation(locationsNumber);
          const legalEntityIds = [loc1.legalEntity.toString(), loc2.legalEntity.toString()];
          const filterQuery: FilterQuery<ILocation> = { $and: [{ legalEntity: { $in: legalEntityIds } }] };
          const filteredCount = await Location.find(filterQuery).count();
          const expectedNames = (await LegalEntity.find({ _id: { $in: legalEntityIds } }))
            .map((legalEntity) => legalEntity.name)
            .sort();
          const res = await request.post(`/locations`).send({ filterQuery });
          const locationsListData = res.body;
          const locationsList = locationsListData.locations as IFrontendLocation[];
          const receivedNames = locationsList.map((loc) => loc.legalEntity).sort();

          expect(res.statusCode).toBe(200);
          expect(locationsList.length).toBe(2);
          expect(receivedNames).toEqual(expectedNames);
          expect(locationsListData.filtered).toBe(true);
          expect(locationsListData.count).toBe(filteredCount);
        });

        test('фильтрация по форматам', async () => {
          const [loc1, loc2] = await addLocation(locationsNumber);
          const formatIds = [loc1.format.toString(), loc2.format.toString()];
          const filterQuery: FilterQuery<ILocation> = { $and: [{ format: { $in: formatIds } }] };
          const filteredCount = await Location.find(filterQuery).count();
          const expectedNames = (await Format.find({ _id: { $in: formatIds } })).map((format) => format.name).sort();
          const res = await request.post(`/locations`).send({ filterQuery });
          const locationsListData = res.body;
          const locationsList = locationsListData.locations as IFrontendLocation[];
          const receivedNames = locationsList.map((loc) => loc.format).sort();

          expect(res.statusCode).toBe(200);
          expect(locationsList.length).toBe(2);
          expect(receivedNames).toEqual(expectedNames);
          expect(locationsListData.filtered).toBe(true);
          expect(locationsListData.count).toBe(filteredCount);
        });

        test('фильтрация по размерам', async () => {
          const [loc1, loc2] = await addLocation(locationsNumber);
          const sizeIds = [loc1.size.toString(), loc2.size.toString()];
          const filterQuery: FilterQuery<ILocation> = { $and: [{ size: { $in: sizeIds } }] };
          const filteredCount = await Location.find(filterQuery).count();
          const expectedNames = (await Size.find({ _id: { $in: sizeIds } })).map((size) => size.name).sort();
          const res = await request.post(`/locations`).send({ filterQuery });
          const locationsListData = res.body;
          const locationsList = locationsListData.locations as IFrontendLocation[];
          const receivedNames = locationsList.map((loc) => loc.size).sort();

          expect(res.statusCode).toBe(200);
          expect(locationsList.length).toBe(2);
          expect(receivedNames).toEqual(expectedNames);
          expect(locationsListData.filtered).toBe(true);
          expect(locationsListData.count).toBe(filteredCount);
        });

        test('фильтрация по освещению', async () => {
          const [loc1, loc2] = await addLocation(locationsNumber);
          const lightingIds = [loc1.lighting.toString(), loc2.lighting.toString()];
          const filterQuery: FilterQuery<ILocation> = { $and: [{ lighting: { $in: lightingIds } }] };
          const filteredCount = await Location.find(filterQuery).count();
          const expectedNames = (await Lighting.find({ _id: { $in: lightingIds } }))
            .map((lighting) => lighting.name)
            .sort();
          const res = await request.post(`/locations`).send({ filterQuery });
          const locationsListData = res.body;
          const locationsList = locationsListData.locations as IFrontendLocation[];
          const receivedNames = locationsList.map((loc) => loc.lighting).sort();

          expect(res.statusCode).toBe(200);
          expect(locationsList.length).toBe(2);
          expect(receivedNames).toEqual(expectedNames);
          expect(locationsListData.filtered).toBe(true);
          expect(locationsListData.count).toBe(filteredCount);
        });

        test('фильтрация по расположению', async () => {
          await addLocation(locationsNumber);
          const filteredCount = await Location.find({ rent: null }).count();
          const filterQuery: FilterQuery<ILocation> = { $and: [{ rent: null }] };
          const res = await request.post(`/locations`).send({ filterQuery });
          const locationsListData = res.body;

          expect(res.statusCode).toBe(200);
          expect(locationsListData.filtered).toBe(true);
          expect(locationsListData.count).toBe(filteredCount);
        });

        test('фильтрация по аренде', async () => {
          await addLocation(locationsNumber);
          const filteredCount = await Location.find({ placement: true }).count();
          const filterQuery: FilterQuery<ILocation> = { $and: [{ placement: true }] };
          const res = await request.post(`/locations`).send({ filterQuery });
          const locationsListData = res.body;

          expect(res.statusCode).toBe(200);
          expect(locationsListData.filtered).toBe(true);
          expect(locationsListData.count).toBe(filteredCount);
        });
      });
    });
  });

  describe('POST /locations/filter', () => {
    describe('любой пользователь пытается получить актуальные данные для селектов фильтра', () => {
      test('должен возвращать statusCode 200 и только сущности используемые в существующих локациях', async () => {
        const locationsNumber = 30;
        await addLocation(locationsNumber);
        const [area] = await Area.create({ name: 'unused area 1' }, { name: 'unused area 2' });
        const city = await City.create({ area: area._id, name: 'unused city 1' });
        await Promise.all([
          Region.create({ city: city._id, name: 'unused region 1' }),
          Street.create({ city: city._id, name: 'unused street 1' }),
          Direction.create({ name: 'unused direction 1' }),
          Format.create({ name: 'unused format 1' }),
          Size.create({ name: 'unused size 1' }),
          Lighting.create({ name: 'unused lighting 1' }),
          LegalEntity.create({ name: 'unused legal entity 1' }),
        ]);
        const res = await request.post(`/locations/filter`);
        const receivedResponse = res.body;

        expect(res.statusCode).toBe(200);
        expect(receivedResponse.count).toBe(locationsNumber);
        expect(receivedResponse.criteria.streets.length).toBe(locationsNumber * 2);
        expect(receivedResponse.criteria.areas.length).toBe(locationsNumber);
        expect(receivedResponse.criteria.directions.length).toBe(locationsNumber);
        expect(receivedResponse.criteria.regions.length).toBe(locationsNumber);
        expect(receivedResponse.criteria.cities.length).toBe(locationsNumber);
        expect(receivedResponse.criteria.formats.length).toBe(locationsNumber);
        expect(receivedResponse.criteria.sizes.length).toBe(locationsNumber);
        expect(receivedResponse.criteria.legalEntities.length).toBe(locationsNumber);
        expect(receivedResponse.criteria.lightings.length).toBe(locationsNumber);
      });
    });
  });

  describe('GET /locations/getItems', () => {
    describe('любой пользователь пытается получить данные нескольких сущностей одним запросом', () => {
      test('должен возвращать statusCode 200 и корректные данные', async () => {
        for (let i = 0; i < 15; i++) {
          const area = await Area.create({ name: `area${i}` });
          const city = await City.create({ name: `city${i}`, area: area._id });
          await Format.create({ name: `format${i}` });
          await Region.create({ name: `region${i}`, city: city._id });
          await Direction.create({ name: `direction${i}` });
          await Lighting.create({ name: `lighting${i}` });
          await LegalEntity.create({ name: `legalEntity${i}` });
          await Size.create({ name: `${i}x${i}` });
        }

        const res = await request.get(`/locations/getItems`);
        const items: GetItemsResponse = res.body;

        expect(res.statusCode).toBe(200);
        expect(Object.keys(items).every((name) => items[name as keyof GetItemsResponse].length === 15)).toBe(true);
        expect(
          Object.keys(items).every((name) => mongoose.isValidObjectId(items[name as keyof GetItemsResponse][0]._id)),
        ).toBe(true);
        expect(
          Object.keys(items).every((name) => typeof items[name as keyof GetItemsResponse][0].name === 'string'),
        ).toBe(true);
      });
    });
  });

  describe('GET /locations/:id', () => {
    describe('любой пользователь пытается получить информацию одной локации', () => {
      test('должен возвращать statusCode 200 и корректные данные', async () => {
        const loc = await createOneLocation();
        const id = loc._id.toString();
        const [aggregatedLoc] = await Location.aggregate([
          { $match: { _id: new Types.ObjectId(id) } },
          ...flattenLookup,
        ]);
        const expectedLocation = {
          ...aggregatedLoc,
          _id: aggregatedLoc._id.toString(),
          streets: aggregatedLoc.streets.slice().sort(),
          rent: aggregatedLoc.rent
            ? { start: aggregatedLoc.rent.start.toISOString(), end: aggregatedLoc.rent.end.toISOString() }
            : null,
        };
        const res = await request.get(`/locations/${id}`);
        const locationResponse = res.body;

        locationResponse.streets.sort();

        expect(res.statusCode).toBe(200);
        expect(locationResponse).toEqual(expectedLocation);
      });

      test('передав некорректный mongodb id, должен возвращать statusCode 422 и сообщение об ошибке', async () => {
        const res = await request.get(`/locations/invalid-id`);
        const errorMessage = res.body.error;

        expect(res.statusCode).toBe(422);
        expect(errorMessage).toBe('Некорректный id локации.');
      });

      test('передав корректный id , но не существующий в базе, должен возвращать statusCode 422 и сообщение об ошибке', async () => {
        const validMongoId = new Types.ObjectId();
        const res = await request.get(`/locations/${validMongoId}`);
        const errorMessage = res.body.error;

        expect(res.statusCode).toBe(404);
        expect(errorMessage).toBe('Локация не существует в базе.');
      });
    });
  });

  describe('GET /locations/edit/:id', () => {
    test('неавторизованный пользователь пытается получить 1 локацию без агрегации, должен возвращать statusCode 401 и сообщение об ошибке', async () => {
      const loc = await createOneLocation();
      const id = loc._id.toString();
      const res = await request.get(`/locations/edit/${id}`);
      const errorMessage = res.body.error;

      expect(res.statusCode).toBe(401);
      expect(errorMessage).toBe('Отсутствует токен авторизации.');
    });

    test('пользователь с рандомным токеном пытается получить 1 локацию без агрегации, должен возвращать statusCode 401 и сообщение об ошибке', async () => {
      const loc = await createOneLocation();
      const id = loc._id.toString();
      const res = await request.get(`/locations/edit/${id}`).set({ Authorization: 'some-token' });
      const errorMessage = res.body.error;

      expect(res.statusCode).toBe(401);
      expect(errorMessage).toBe('Предоставлен неверный токен авторизации.');
    });

    describe('пользователь с ролью "user" пытается получить 1 локацию без агрегации', () => {
      test('указав некоррекный mongodb id, возвращает statusCode 422 и сообщение об ошибке', async () => {
        const res = await request.get(`/locations/edit/random-id`).set({ Authorization: userToken });
        const errorMessage = res.body.error;

        expect(res.statusCode).toBe(422);
        expect(errorMessage).toBe('Некорректный id локации.');
      });

      test('указав коррекный mongodb id, но не существующий в базе, возвращает statusCode 404 и сообщение об ошибке', async () => {
        const validMongoID = new Types.ObjectId().toString();
        const res = await request.get(`/locations/edit/${validMongoID}`).set({ Authorization: userToken });
        const errorMessage = res.body.error;

        expect(res.statusCode).toBe(404);
        expect(errorMessage).toBe('Локация не существует в базе.');
      });

      test('должен возвращать statusCode 200 и корректные данные', async () => {
        const loc = await createOneLocation();
        const id = loc._id.toString();
        const res = await request.get(`/locations/edit/${id}`).set({ Authorization: userToken });
        const responseLoc = res.body;

        expect(res.statusCode).toBe(200);
        expect(responseLoc._id).toBe(id);
        expect(mongoose.isValidObjectId(responseLoc.size)).toBe(true);
        expect(mongoose.isValidObjectId(responseLoc.city)).toBe(true);
        expect(mongoose.isValidObjectId(responseLoc.area)).toBe(true);
        expect(mongoose.isValidObjectId(responseLoc.lighting)).toBe(true);
      });
    });

    describe('пользователь с ролью "admin" пытается получить 1 локацию без агрегации', () => {
      test('должен возвращать statusCode 200 и корректные данные', async () => {
        const loc = await createOneLocation();
        const id = loc._id.toString();
        const res = await request.get(`/locations/edit/${id}`).set({ Authorization: adminToken });
        const responseLoc = res.body;

        expect(res.statusCode).toBe(200);
        expect(responseLoc._id).toBe(id);
        expect(mongoose.isValidObjectId(responseLoc.city)).toBe(true);
        expect(mongoose.isValidObjectId(responseLoc.size)).toBe(true);
        expect(mongoose.isValidObjectId(responseLoc.area)).toBe(true);
        expect(mongoose.isValidObjectId(responseLoc.lighting)).toBe(true);
      });
    });
  });

  describe('POST /location/create', () => {
    test('неавторизованный пользователь пытается создать локацию, дожен возвращать statusCode 401 и сообщение об ошибке', async () => {
      const res = await request.post('/locations/create');
      const errorMessage = res.body.error;

      expect(res.statusCode).toBe(401);
      expect(errorMessage).toBe('Отсутствует токен авторизации.');
    });

    test('пользователь с ролью "user" пытается создать локацию, дожен возвращать statusCode 201 и объект созданной локации', async () => {
      const newLocationDto = await createLocationDto();
      const res = await request
        .post('/locations/create')
        .set({ Authorization: userToken })
        .attach('dayImage', './tests/testFiles/dayImage.jpg')
        .attach('schemaImage', './tests/testFiles/schemaImage.png')
        .field('area', newLocationDto.area.toString())
        .field('city', newLocationDto.city.toString())
        .field('region', newLocationDto.region.toString())
        .field('direction', newLocationDto.direction.toString())
        .field('format', newLocationDto.format.toString())
        .field('lighting', newLocationDto.lighting.toString())
        .field('legalEntity', newLocationDto.legalEntity.toString())
        .field('placement', newLocationDto.placement)
        .field('price', newLocationDto.price)
        .field('size', newLocationDto.size)
        .field('streets[]', newLocationDto.street1.toString())
        .field('streets[]', newLocationDto.street2.toString());
      const createLocResponse = res.body;

      expect(res.statusCode).toBe(201);
      expect(createLocResponse.message).toBe('Новая локация успешно создана!');
    });

    test('пользователь с ролью "admin" пытается создать локацию, дожен возвращать statusCode 201 и объект созданной локации', async () => {
      const newLocationDto = await createLocationDto();
      const res = await request
        .post('/locations/create')
        .set({ Authorization: adminToken })
        .attach('dayImage', './tests/testFiles/dayImage.jpg')
        .attach('schemaImage', './tests/testFiles/schemaImage.png')
        .field('area', newLocationDto.area.toString())
        .field('city', newLocationDto.city.toString())
        .field('region', newLocationDto.region.toString())
        .field('direction', newLocationDto.direction.toString())
        .field('format', newLocationDto.format.toString())
        .field('lighting', newLocationDto.lighting.toString())
        .field('legalEntity', newLocationDto.legalEntity.toString())
        .field('placement', newLocationDto.placement)
        .field('price', newLocationDto.price)
        .field('size', newLocationDto.size)
        .field('streets[]', newLocationDto.street1.toString())
        .field('streets[]', newLocationDto.street2.toString());
      const createLocResponse = res.body;

      expect(res.statusCode).toBe(201);
      expect(createLocResponse.message).toBe('Новая локация успешно создана!');
    });
  });

  describe('PUT /location/edit/:id', () => {
    test('неавторизованный пользователь пытается отредактировать локацию, дожен возвращать statusCode 401 и сообщение об ошибке', async () => {
      const loc = await createOneLocation();
      const id = loc._id.toString();
      const res = await request.put(`/locations/edit/${id}`);
      const errorMessage = res.body.error;

      expect(res.statusCode).toBe(401);
      expect(errorMessage).toBe('Отсутствует токен авторизации.');
    });

    test('пользователь с ролью "user" пытается отредактировать локацию, дожен возвращать statusCode 200 и объект созданной локации', async () => {
      const loc = await createOneLocation();
      const id = loc._id.toString();
      const area = await Area.create({ name: 'some new area' });
      const city = await City.create({ name: 'some new city', area: area._id });
      const [newStreet1, newStreet2] = await Street.create(
        { name: 'some new street 1', city: city._id },
        { name: 'some new street 2', city: city._id },
      );
      const updateDto = {
        price: '250',
        street1: newStreet1._id.toString(),
        street2: newStreet2._id.toString(),
        region: '',
        placement: 'true',
      };
      const res = await request
        .put(`/locations/edit/${id}`)
        .set({ Authorization: userToken })
        .attach('dayImage', './tests/testFiles/dayImage.jpg')
        .attach('schemaImage', './tests/testFiles/schemaImage.png')
        .field('price', updateDto.price)
        .field('region', updateDto.region)
        .field('placement', updateDto.placement)
        .field('streets[]', updateDto.street1)
        .field('streets[]', updateDto.street2);
      const updateMessage = res.body.message;

      expect(res.statusCode).toBe(200);
      expect(updateMessage).toBe('Локация успешно отредактирована!');

      const editedLoc = await Location.findById(id);

      if (editedLoc) {
        expect(editedLoc.price.toString()).toBe('250');
      }
    });

    test('пользователь с ролью "admin" пытается отредактировать локацию, дожен возвращать statusCode 200 и объект созданной локации', async () => {
      const loc = await createOneLocation();
      const id = loc._id.toString();
      const area = await Area.create({ name: 'some new area' });
      const city = await City.create({ name: 'some new city', area: area._id });
      const [newStreet1, newStreet2] = await Street.create(
        { name: 'some new street 1', city: city._id },
        { name: 'some new street 2', city: city._id },
      );
      const updateDto = {
        price: '250',
        street1: newStreet1._id.toString(),
        street2: newStreet2._id.toString(),
        region: '',
        placement: 'true',
      };
      const res = await request
        .put(`/locations/edit/${id}`)
        .set({ Authorization: adminToken })
        .attach('dayImage', './tests/testFiles/dayImage.jpg')
        .attach('schemaImage', './tests/testFiles/schemaImage.png')
        .field('price', updateDto.price)
        .field('region', updateDto.region)
        .field('placement', updateDto.placement)
        .field('streets[]', updateDto.street1)
        .field('streets[]', updateDto.street2);
      const updateMessage = res.body.message;

      expect(res.statusCode).toBe(200);
      expect(updateMessage).toBe('Локация успешно отредактирована!');

      const editedLoc = await Location.findById(id);

      if (editedLoc) {
        expect(editedLoc.price.toString()).toBe('250');
      }
    });

    test('авторизованный пользователь передал некорректный mongodb id, должен вернуть statusCode 422 и сообщение об ошибке', async () => {
      const invalidId = 'some-random-id';
      const res = await request.put(`/locations/edit/${invalidId}`).set({ Authorization: adminToken });
      const errorMessage = res.body.error;

      expect(res.statusCode).toBe(422);
      expect(errorMessage).toBe('Некорректный id локации.');
    });

    test('авторизованный пользователь передал корректный, но не существующий в базе id, должен вернуть statusCode 404 и сообщение об ошибке', async () => {
      const validMongoId = new Types.ObjectId().toString();
      const res = await request.put(`/locations/edit/${validMongoId}`).set({ Authorization: adminToken });
      const errorMessage = res.body.error;

      expect(res.statusCode).toBe(404);
      expect(errorMessage).toBe('Локация не существует в базе.');
    });
  });

  describe('DELETE /locations/:id', () => {
    test('неавторизованный пользователь пытается удалить локацию по id, должен возвращать statusCode 401 и сообщение об ошибке', async () => {
      const loc = await createOneLocation();
      const id = loc._id.toString();
      const res = await request.delete(`/locations/${id}`);
      const errorMessage = res.body.error;

      expect(res.statusCode).toBe(401);
      expect(errorMessage).toBe('Отсутствует токен авторизации.');
    });

    test('пользователь с ролью "user" пытается удалить локацию по id, должен возвращать statusCode 200', async () => {
      const loc = await createOneLocation();
      const id = loc._id.toString();
      const res = await request.delete(`/locations/${id}`).set({ Authorization: userToken });
      const result = res.body;

      expect(res.statusCode).toBe(200);
      expect(result.deletedCount).toBe(1);
    });

    test('пользователь с ролью "admin" пытается удалить локацию по id, должен возвращать statusCode 200', async () => {
      const loc = await createOneLocation();
      const id = loc._id.toString();
      const res = await request.delete(`/locations/${id}`).set({ Authorization: adminToken });
      const result = res.body;

      expect(res.statusCode).toBe(200);
      expect(result.deletedCount).toBe(1);
    });

    test('авторизованный пользователь передал неверный mongodb id, должен возвращать statusCode 422 и сообщение об ошибке', async () => {
      const res = await request.delete(`/locations/invalid-id`).set({ Authorization: adminToken });
      const errorMessage = res.body.error;

      expect(res.statusCode).toBe(422);
      expect(errorMessage).toBe('Некорректный id локации.');
    });

    test('авторизованный пользователь передал корректный, но не существующий в базе id, должен возвращать statusCode 404 и сообщение об ошибке', async () => {
      const validMongoId = new Types.ObjectId().toString();
      const res = await request.delete(`/locations/${validMongoId}`).set({ Authorization: adminToken });
      const errorMessage = res.body.error;

      expect(res.statusCode).toBe(404);
      expect(errorMessage).toBe('Удаление невозможно: локация не существует в базе.');
    });
  });

  describe('PATCH /locations/checked', () => {
    test('неавторизованный пользователь пытается изменить поле checked локации по id из query string, дожен возврещать statusCode 401 и сообщение об ошибке', async () => {
      const loc = await createOneLocation();
      const id = loc._id.toString();
      const res = await request.patch(`/locations/checked?checked=${id}`);
      const errorMessage = res.body.error;

      expect(res.statusCode).toBe(401);
      expect(errorMessage).toBe('Отсутствует токен авторизации.');
    });

    test('пользователь c ролью "user" пытается изменить поле checked локации по id из query string, дожен возврещать statusCode 204', async () => {
      const loc = await createOneLocation();
      const id = loc._id.toString();
      const res = await request
        .patch(`/locations/checked?checked=${id}`)
        .set({ Authorization: userToken })
        .send({ checked: true });

      expect(res.statusCode).toBe(204);

      const changedLoc = await Location.findById(id);

      if (changedLoc) {
        expect(changedLoc.checked).toBe(true);
      }
    });

    test('пользователь c ролью "admin" пытается изменить поле checked локации по id из query string, дожен возврещать statusCode 204', async () => {
      const loc = await createOneLocation();
      const id = loc._id.toString();
      const res = await request
        .patch(`/locations/checked?checked=${id}`)
        .set({ Authorization: adminToken })
        .send({ checked: true });

      expect(res.statusCode).toBe(204);

      const changedLoc = await Location.findById(id);

      if (changedLoc) {
        expect(changedLoc.checked).toBe(true);
      }
    });

    test('авторизованный пользователь пытается изменить поле checked локации по некорректному id из query string, дожен возврещать statusCode 422 и сообщение об ошибке', async () => {
      const id = 'random-string-id';
      const res = await request.patch(`/locations/checked?checked=${id}`).set({ Authorization: adminToken });
      const errorMessage = res.body.error;

      expect(res.statusCode).toBe(422);
      expect(errorMessage).toBe('Некорректный id локации.');
    });

    test('авторизованный пользователь пытается изменить поле checked локации по несуществующий в базе id из query string, дожен возврещать statusCode 422 и сообщение об ошибке', async () => {
      const id = new Types.ObjectId().toString();
      const res = await request.patch(`/locations/checked?checked=${id}`).set({ Authorization: adminToken });
      const errorMessage = res.body.error;

      expect(res.statusCode).toBe(404);
      expect(errorMessage).toBe('Локации не существует в базе.');
    });

    test('авторизованный пользователь пытается изменить поле checked у нескольких локаций, передав query param allChecked=true, дожен возврещать statusCode 200', async () => {
      const loc1 = await createOneLocation();
      const loc2 = await createOneLocation();
      loc1.checked = true;
      loc2.checked = true;
      await loc1.save();
      await loc2.save();
      const id1 = loc1._id.toString();
      const id2 = loc2._id.toString();
      const res = await request.patch(`/locations/checked?allChecked=true`).set({ Authorization: adminToken });
      const patchResult = res.body;

      expect(res.statusCode).toBe(200);
      expect(patchResult.patch).toBe(false);

      const changedLoc1 = await Location.findById(id1);
      const changedLoc2 = await Location.findById(id2);

      if (changedLoc1 && changedLoc2) {
        expect(changedLoc1.checked).toBe(false);
        expect(changedLoc2.checked).toBe(false);
      }
    });
  });

  describe('PATCH /locations/updateRent/:id', () => {
    test('неавторизованный пользователь пытается изменить поле rent локации, дожен возврещать statusCode 401 и сообщение об ошибке', async () => {
      const loc = await createOneLocation();
      const id = loc._id.toString();
      const res = await request.patch(`/locations/updateRent/${id}`);
      const errorMessage = res.body.error;

      expect(res.statusCode).toBe(401);
      expect(errorMessage).toBe('Отсутствует токен авторизации.');
    });

    test('авторизованный пытается изменить поле rent локации, дожен возврещать statusCode 200', async () => {
      const loc = await createOneLocation();
      const id = loc._id.toString();
      const client = await Client.create({
        companyName: 'Арбуз',
        companyPhone: '+996551178715',
        companyEmail: 'arbuz@gmail.com',
      });
      loc.rent = null;
      await loc.save();
      const rentUpdateDto: IRentUpdateDto = {
        price: '5500',
        date: {
          start: '2023-06-17T04:46:29.958Z',
          end: '2023-11-18T04:46:29.958Z',
        },
        client: client._id.toString(),
      };
      const res = await request
        .patch(`/locations/updateRent/${id}`)
        .set({ Authorization: userToken })
        .send(rentUpdateDto);

      expect(res.statusCode).toBe(200);

      const updateHistoryRecord = await RentHistory.findOne({ $and: [{ client: client._id }, { location: loc._id }] });

      expect(updateHistoryRecord).toBeTruthy();
    });

    test('авторизованный пользователь пытается изменить поле rent локации, передав некорректный mongodb id, дожен возврещать statusCode 422 и сообщение об ошибке', async () => {
      const id = 'random-invalid-id';
      const res = await request.patch(`/locations/updateRent/${id}`).set({ Authorization: userToken });
      const errorMessage = res.body.error;

      expect(res.statusCode).toBe(422);
      expect(errorMessage).toBe('Некорректный id локации.');
    });

    test('авторизованный пользователь пытается изменить поле rent локации, передав несуществующий id, дожен возврещать statusCode 404 и сообщение об ошибке', async () => {
      const id = new Types.ObjectId().toString();
      const res = await request.patch(`/locations/updateRent/${id}`).set({ Authorization: userToken });
      const errorMessage = res.body.error;

      expect(res.statusCode).toBe(404);
      expect(errorMessage).toBe('Данная локация не найдена!');
    });
  });
});

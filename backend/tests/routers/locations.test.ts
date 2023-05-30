import app from '../app';
import supertest from 'supertest';
import { randomUUID } from 'crypto';
import * as db from '../db';
import User from '../../models/Users';
import Size from '../../models/Size';
import Location from '../../models/Location';
import mongoose, { FilterQuery, HydratedDocument } from 'mongoose';
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

const addLocation = async (number: number) => {
  const locations: HydratedDocument<ILocation>[] = [];

  for (let i = 0; i < number; i++) {
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
    const location = await Location.create({
      legalEntity: legalEntity._id,
      format: format._id,
      direction: direction._id,
      lighting: lighting._id,
      region: region._id,
      size: size._id,
      area: area._id,
      city: city._id,
      streets: [street1._id, street2._id],
      price: mongoose.Types.Decimal128.fromString(`${i}000`),
      placement,
      rent,
      dayImage: `some/path${i}`,
      schemaImage: `some/path${i}`,
    });

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
});

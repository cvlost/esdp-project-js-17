import express from 'express';
import auth from '../middleware/auth';
import Location from '../models/Location';
import mongoose, { FilterQuery, PipelineStage, Types } from 'mongoose';
import Region from '../models/Region';
import City from '../models/City';
import Direction from '../models/Direction';
import { imagesUpload } from '../multer';
import { ILocation } from '../types';
import Street from '../models/Street';
import Area from '../models/Area';
import Format from '../models/Format';
import LegalEntity from '../models/LegalEntity';
import { BILLBOARD_LIGHTINGS, BILLBOARD_SIZES } from '../constants';
import { promises as fs } from 'fs';
import config from '../config';

const locationsRouter = express.Router();

const flattenLookup: PipelineStage[] = [
  { $lookup: { from: 'cities', localField: 'city', foreignField: '_id', as: 'city' } },
  { $lookup: { from: 'regions', localField: 'region', foreignField: '_id', as: 'region' } },
  { $lookup: { from: 'streets', localField: 'street', foreignField: '_id', as: 'street' } },
  { $lookup: { from: 'areas', localField: 'area', foreignField: '_id', as: 'area' } },
  { $lookup: { from: 'formats', localField: 'format', foreignField: '_id', as: 'format' } },
  { $lookup: { from: 'directions', localField: 'direction', foreignField: '_id', as: 'direction' } },
  { $lookup: { from: 'legalentities', localField: 'legalEntity', foreignField: '_id', as: 'legalEntity' } },
  { $set: { city: { $first: '$city.name' } } },
  { $set: { region: { $first: '$region.name' } } },
  { $set: { street: { $first: '$street.name' } } },
  { $set: { direction: { $first: '$direction.name' } } },
  { $set: { area: { $first: '$area.name' } } },
  { $set: { format: { $first: '$format.name' } } },
  { $set: { legalEntity: { $first: '$legalEntity.name' } } },
  { $set: { price: { $convert: { input: '$price', to: 'string' } } } },
];

locationsRouter.post('/', async (req, res, next) => {
  let perPage = parseInt(req.query.perPage as string);
  let page = parseInt(req.query.page as string);
  const filter: FilterQuery<ILocation> = req.body.filterQuery ? req.body.filterQuery : {};

  page = isNaN(page) || page <= 0 ? 1 : page;
  perPage = isNaN(perPage) || perPage <= 0 ? 10 : perPage;

  try {
    const filteredLocations = await Location.find(filter);
    const count = filteredLocations.length;
    let pages = Math.ceil(count / perPage);

    if (pages === 0) pages = 1;
    if (page > pages) page = pages;

    const locations = await Location.aggregate([
      { $match: { _id: { $in: filteredLocations.map((loc) => loc._id) } } },
      { $skip: (page - 1) * perPage },
      { $limit: perPage },
      { $sort: { _id: -1 } },
      ...flattenLookup,
      { $project: { country: 0, description: 0 } },
    ]);

    return res.send({ locations, filtered: !!req.body.filterQuery, page, pages, count, perPage });
  } catch (e) {
    return next(e);
  }
});

locationsRouter.post('/filter', async (req, res, next) => {
  const filter: FilterQuery<ILocation> = req.body.filterQuery ? req.body.filterQuery : {};

  try {
    const [allLocations, filteredLocations] = await Promise.all([Location.find().lean(), Location.find(filter).lean()]);
    const [streets, areas, directions, regions, cities, formats, legalEntities] = await Promise.all([
      Street.find({ _id: { $in: [...new Set(allLocations.map((loc) => loc.street))] } }).lean(),
      Area.find({ _id: { $in: [...new Set(allLocations.map((loc) => loc.area))] } }).lean(),
      Direction.find({ _id: { $in: [...new Set(allLocations.map((loc) => loc.direction))] } }).lean(),
      Region.find({ _id: { $in: [...new Set(allLocations.map((loc) => loc.region))] } }).lean(),
      City.find({ _id: { $in: [...new Set(allLocations.map((loc) => loc.city))] } }).lean(),
      Format.find({ _id: { $in: [...new Set(allLocations.map((loc) => loc.format))] } }).lean(),
      LegalEntity.find({ _id: { $in: [...new Set(allLocations.map((loc) => loc.legalEntity))] } }).lean(),
    ]);
    const sizes = BILLBOARD_SIZES;
    const lightings = BILLBOARD_LIGHTINGS;

    const count = filteredLocations.length;
    const locationsId = filteredLocations.map((loc) => loc._id);
    const priceRange = filteredLocations.map((loc) => loc.price.toString()).sort((a, b) => Number(a) - Number(b));

    res.send({
      count,
      priceRange,
      locationsId,
      criteria: {
        streets,
        areas,
        directions,
        regions,
        cities,
        formats,
        sizes,
        legalEntities,
        lightings,
      },
    });
  } catch (e) {
    return next(e);
  }
});

locationsRouter.get('/:id', async (req, res, next) => {
  const _id = req.params.id as string;

  try {
    const [location] = await Location.aggregate([{ $match: { _id: new Types.ObjectId(_id) } }, ...flattenLookup]);
    return res.send(location);
  } catch (e) {
    return next(e);
  }
});

locationsRouter.post(
  '/create',
  imagesUpload.fields([{ name: 'dayImage', maxCount: 1 }, { name: 'schemaImage' }]),
  auth,
  async (req, res, next) => {
    const files = req.files as { [filename: string]: Express.Multer.File[] };

    const locationObj: ILocation = {
      country: req.body.country,
      area: req.body.area,
      region: req.body.region.length > 0 ? req.body.region : null,
      city: req.body.city,
      street: req.body.street,
      direction: req.body.direction,
      legalEntity: req.body.legalEntity,
      format: req.body.format,
      price: mongoose.Types.Decimal128.fromString(req.body.price),
      rent: null,
      reserve: req.body.reserve,
      lighting: req.body.lighting,
      placement: JSON.parse(req.body.placement),
      size: req.body.size,
      addressNote: req.body.addressNote,
      description: req.body.description,
      dayImage: files['dayImage'][0].filename,
      schemaImage: files['schemaImage'][0].filename,
      client: req.body.client,
      booking: req.body.booking,
      nearest_booking_date: req.body.nearest_booking_date,
    };

    try {
      const locationData = await Location.create(locationObj);
      return res.send({
        message: 'Новая локация успешно создана!',
        location: await Location.populate(locationData, 'region direction city'),
      });
    } catch (e) {
      if (e instanceof mongoose.Error.ValidationError) {
        return res.status(400).send(e);
      }
      return next(e);
    }
  },
);

locationsRouter.put(
  '/edit/:id',
  auth,
  imagesUpload.fields([{ name: 'dayImage', maxCount: 1 }, { name: 'schemaImage' }]),
  async (req, res, next) => {
    const files = req.files as { [filename: string]: Express.Multer.File[] };
    const id = req.params.id as string;
    const {
      addressNote,
      area,
      region,
      city,
      street,
      format,
      size,
      legalEntity,
      lighting,
      placement,
      direction,
      description,
      price,
    } = req.body;

    try {
      const location = await Location.findById(id);

      if (!location) {
        return res.status(400).send({ error: 'Редактирование невозможно: локация не существует в базе.' });
      }
      if (area && area !== location.area.toString()) {
        const anotherArea = await Area.findById(area);
        if (!anotherArea) {
          return res.status(400).send({ error: 'Редактирование невозможно: неверный id области.' });
        }
        location.area = anotherArea._id;
      }

      if (region && region !== location.region.toString()) {
        const anotherRegion = await Region.findById(region);
        if (!anotherRegion) {
          return res.status(400).send({ error: 'Редактирование невозможно: неверый id района.' });
        }
        location.region = anotherRegion._id;
      }

      if (city && city !== location.city.toString()) {
        const anotherCity = await City.findById(city);
        if (!anotherCity) {
          return res.status(400).send({ error: 'Редактирование невозможно: неверый id города.' });
        }
        location.city = anotherCity._id;
      }
      if (street && street !== location.street.toString()) {
        const anotherStreet = await Street.findById(street);
        if (!anotherStreet) {
          return res.status(400).send({ error: 'Редактирование невозможно: неверный id улицы.' });
        }
        location.street = anotherStreet._id;
      }

      if (direction && direction !== location.direction.toString()) {
        const anotherDirection = await Direction.findById(direction);
        if (!anotherDirection) {
          return res.status(400).send({ error: 'Редактирование невозможно: неверый id направления.' });
        }
        location.direction = anotherDirection._id;
      }

      if (size && size !== location.size) {
        location.size = size;
      }

      if (format && format !== location.format.toString()) {
        const anotherFormat = await Format.findById(format);
        if (!anotherFormat) {
          return res.status(400).send({ error: 'Редактирование невозможно: неверный id формата.' });
        }
        location.format = anotherFormat._id;
      }

      if (legalEntity && legalEntity !== location.legalEntity.toString()) {
        const anotherLG = await LegalEntity.findById(legalEntity);
        if (!anotherLG) {
          return res.status(400).send({ error: 'Редактирование невозможно: неверный id юр лица.' });
        }
        location.legalEntity = anotherLG._id;
      }

      if (lighting && lighting !== location.lighting) {
        location.lighting = lighting;
      }

      if (placement && placement !== location.placement.toString()) {
        location.placement = !location.placement;
      }

      if (price)
        if (typeof addressNote === 'string' && addressNote !== location.addressNote) {
          location.addressNote = addressNote;
        }

      if (typeof description === 'string' && description !== location.description) {
        location.description = description;
      }

      if (price && price !== location.price.toString()) {
        location.price = mongoose.Types.Decimal128.fromString(price);
      }

      if (req.files) {
        if (location.dayImage !== null && files['dayImage']) {
          await fs.unlink(config.publicPath + '/' + location.dayImage);
        }
        if (location.schemaImage !== null && files['schemaImage']) {
          await fs.unlink(config.publicPath + '/' + location.schemaImage);
        }
        location.dayImage = req.files && files['dayImage'] && 'images/day/' + files['dayImage'][0].filename;
        location.schemaImage = req.files && files['schemaImage'] && 'images/schema/' + files['schemaImage'][0].filename;
      }

      const result = await location.save();
      return res.send(await Location.populate(result, 'direction city region'));
    } catch (e) {
      if (req.files) {
        if (files['dayImage'][0]) {
          await fs.unlink(files['dayImage'][0].path);
        }

        if (files['schemaImage'][0]) {
          await fs.unlink(files['schemaImage'][0].path);
        }
      }
      return next(e);
    }
  },
);

locationsRouter.delete('/:id', auth, async (req, res, next) => {
  try {
    const _id = req.params.id as string;
    const location = await Location.findById(_id);
    if (!location) {
      return res.status(404).send({ error: 'Удаление невозможно: локация не существует в базе.' });
    }

    const result = await Location.deleteOne({ _id }).populate('city direction region');
    return res.send(result);
  } catch (e) {
    return next(e);
  }
});

export default locationsRouter;

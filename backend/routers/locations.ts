import express from 'express';
import auth from '../middleware/auth';
import Location from '../models/Location';
import mongoose, { FilterQuery, PipelineStage, Types } from 'mongoose';
import Region from '../models/Region';
import City from '../models/City';
import Direction from '../models/Direction';
import { imagesUpload } from '../multer';
import { ILocation, RentData } from '../types';
import Street from '../models/Street';
import Area from '../models/Area';
import Format from '../models/Format';
import LegalEntity from '../models/LegalEntity';
import { promises as fs } from 'fs';
import config from '../config';
import path from 'path';
import Size from '../models/Size';
import Lighting from '../models/Lighting';
import RentHistory from '../models/RentHistory';
import * as notificationsService from '../services/notifications-service';

const locationsRouter = express.Router();

export const flattenLookup: PipelineStage[] = [
  { $lookup: { from: 'cities', localField: 'city', foreignField: '_id', as: 'city' } },
  { $lookup: { from: 'regions', localField: 'region', foreignField: '_id', as: 'region' } },
  { $lookup: { from: 'streets', localField: 'streets', foreignField: '_id', as: 'streets' } },
  { $lookup: { from: 'areas', localField: 'area', foreignField: '_id', as: 'area' } },
  { $lookup: { from: 'formats', localField: 'format', foreignField: '_id', as: 'format' } },
  { $lookup: { from: 'directions', localField: 'direction', foreignField: '_id', as: 'direction' } },
  { $lookup: { from: 'legalentities', localField: 'legalEntity', foreignField: '_id', as: 'legalEntity' } },
  { $lookup: { from: 'lightings', localField: 'lighting', foreignField: '_id', as: 'lighting' } },
  { $lookup: { from: 'sizes', localField: 'size', foreignField: '_id', as: 'size' } },
  { $lookup: { from: 'clients', localField: 'client', foreignField: '_id', as: 'client' } },
  {
    $lookup: {
      from: 'bookings',
      localField: 'booking',
      foreignField: '_id',
      as: 'booking',
      pipeline: [
        {
          $lookup: { from: 'clients', localField: 'clientId', foreignField: '_id', as: 'clientId' },
        },
        {
          $set: { clientId: { $first: '$clientId.companyName' } },
        },
      ],
    },
  },
  { $set: { city: { $first: '$city.name' } } },
  { $set: { region: { $first: '$region.name' } } },
  { $set: { streets: { $map: { input: '$streets', as: 'street', in: '$$street.name' } } } },
  { $set: { direction: { $first: '$direction.name' } } },
  { $set: { area: { $first: '$area.name' } } },
  { $set: { format: { $first: '$format.name' } } },
  { $set: { legalEntity: { $first: '$legalEntity.name' } } },
  { $set: { lighting: { $first: '$lighting.name' } } },
  { $set: { size: { $first: '$size.name' } } },
  { $set: { price: { $convert: { input: '$price', to: 'string' } } } },
  { $set: { client: { $first: '$client.companyName' } } },
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
    const [streets, areas, directions, regions, cities, formats, legalEntities, sizes, lightings] = await Promise.all([
      Street.find({ _id: { $in: [...new Set(allLocations.flatMap((loc) => loc.streets))] } }).lean(),
      Area.find({ _id: { $in: [...new Set(allLocations.map((loc) => loc.area))] } }).lean(),
      Direction.find({ _id: { $in: [...new Set(allLocations.map((loc) => loc.direction))] } }).lean(),
      Region.find({ _id: { $in: [...new Set(allLocations.map((loc) => loc.region))] } }).lean(),
      City.find({ _id: { $in: [...new Set(allLocations.map((loc) => loc.city))] } }).lean(),
      Format.find({ _id: { $in: [...new Set(allLocations.map((loc) => loc.format))] } }).lean(),
      LegalEntity.find({ _id: { $in: [...new Set(allLocations.map((loc) => loc.legalEntity))] } }).lean(),
      Size.find({ _id: { $in: [...new Set(allLocations.map((loc) => loc.size))] } }).lean(),
      Lighting.find({ _id: { $in: [...new Set(allLocations.map((loc) => loc.lighting))] } }).lean(),
    ]);

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

locationsRouter.get('/getItems', async (req, res, next) => {
  try {
    const [areas, regions, formats, legalEntity, directions, sizes, lighting] = await Promise.all([
      Area.find(),
      Region.find(),
      Format.find(),
      LegalEntity.find(),
      Direction.find(),
      Size.find(),
      Lighting.find(),
    ]);

    return res.send({ areas, regions, formats, legalEntity, directions, sizes, lighting });
  } catch (e) {
    return next(e);
  }
});

locationsRouter.get('/:id', async (req, res, next) => {
  const _id = req.params.id as string;

  if (!mongoose.isValidObjectId(_id)) {
    return res.status(422).send({ error: 'Некорректный id локации.' });
  }

  try {
    const [location] = await Location.aggregate([{ $match: { _id: new Types.ObjectId(_id) } }, ...flattenLookup]);

    if (!location) {
      return res.status(404).send({ error: 'Локация не существует в базе.' });
    }

    return res.send(location);
  } catch (e) {
    return next(e);
  }
});

locationsRouter.get('/edit/:id', auth, async (req, res, next) => {
  const _id = req.params.id;

  if (!mongoose.isValidObjectId(_id)) {
    return res.status(422).send({ error: 'Некорректный id локации.' });
  }

  try {
    const location = await Location.findOne({ _id });

    if (!location) {
      return res.status(404).send({ error: 'Локация не существует в базе.' });
    }

    return res.send(location);
  } catch (e) {
    return next(e);
  }
});

locationsRouter.post(
  '/create',
  auth,
  imagesUpload.fields([
    { name: 'dayImage', maxCount: 1 },
    { name: 'schemaImage', maxCount: 1 },
  ]),
  async (req, res, next) => {
    const files = req.files as { [filename: string]: Express.Multer.File[] };

    const locationObj: ILocation = {
      country: req.body.country,
      area: req.body.area,
      region: req.body.region.length > 0 ? req.body.region : null,
      city: req.body.city,
      streets: [req.body.streets[0], req.body.streets[1]],
      direction: req.body.direction,
      legalEntity: req.body.legalEntity,
      format: req.body.format,
      price: mongoose.Types.Decimal128.fromString(req.body.price),
      lighting: req.body.lighting,
      placement: JSON.parse(req.body.placement),
      size: req.body.size,
      addressNote: req.body.addressNote,
      description: req.body.description,
      dayImage: req.files && files['dayImage'][0] ? 'images/day/' + files['dayImage'][0].filename : null,
      schemaImage: req.files && files['schemaImage'][0] ? 'images/schema/' + files['schemaImage'][0].filename : null,
    };

    try {
      const locationData = await Location.create(locationObj);
      return res.status(201).send({
        message: 'Новая локация успешно создана!',
        location: await Location.populate(locationData, 'region direction city'),
      });
    } catch (e) {
      if (req.files) {
        const files = req.files as { [filename: string]: Express.Multer.File[] };
        if (files.dayImage) {
          await fs.unlink(files.dayImage[0].path);
        }
        if (files.schemaImage) {
          await fs.unlink(files.schemaImage[0].path);
        }
      }
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
  imagesUpload.fields([
    { name: 'dayImage', maxCount: 1 },
    { name: 'schemaImage', maxCount: 1 },
  ]),
  async (req, res, next) => {
    const files = req.files as { [filename: string]: Express.Multer.File[] };
    const id = req.params.id as string;

    if (!mongoose.isValidObjectId(id)) {
      return res.status(422).send({ error: 'Некорректный id локации.' });
    }

    try {
      const locationOne = await Location.findById(id);

      if (!locationOne) {
        return res.status(404).send({ error: 'Локация не существует в базе.' });
      }

      const locationEdit = {
        country: req.body.country,
        area: req.body.area,
        region: req.body.region.length > 0 ? req.body.region : null,
        city: req.body.city,
        streets: [req.body.streets[0], req.body.streets[1]],
        direction: req.body.direction,
        legalEntity: req.body.legalEntity,
        format: req.body.format,
        price: mongoose.Types.Decimal128.fromString(req.body.price),
        lighting: req.body.lighting,
        placement: JSON.parse(req.body.placement),
        size: req.body.size,
        addressNote: req.body.addressNote,
        description: req.body.description,
      };

      const images = {
        dayImage: files['dayImage'] ? files['dayImage'][0].filename : req.body.dayImage,
        schemaImage: files['schemaImage'] ? files['schemaImage'][0].filename : req.body.schemaImage,
      };

      if (images.dayImage !== locationOne.dayImage) {
        try {
          await fs.unlink(path.join(config.publicPath, `${locationOne.dayImage}`));
        } catch (e) {
          console.log(e);
        }
        if (images.dayImage) {
          await Location.updateOne({ _id: id }, { dayImage: 'images/day/' + images.dayImage });
        }
      }

      if (images.schemaImage !== locationOne.schemaImage) {
        try {
          await fs.unlink(path.join(config.publicPath, `${locationOne.schemaImage}`));
        } catch (e) {
          console.log(e);
        }
        if (images.schemaImage) {
          await Location.updateOne({ _id: id }, { schemaImage: 'images/schema/' + images.schemaImage });
        }
      }

      await Location.updateMany({ _id: id }, locationEdit);
      return res.send({ message: 'Локация успешно отредактирована!' });
    } catch (e) {
      if (req.files) {
        const files = req.files as { [filename: string]: Express.Multer.File[] };
        if (files.dayImage) {
          await fs.unlink(files.dayImage[0].path);
        }
        if (files.schemaImage) {
          await fs.unlink(files.schemaImage[0].path);
        }
      }
      return next(e);
    }
  },
);

locationsRouter.delete('/:id', auth, async (req, res, next) => {
  const _id = req.params.id as string;

  if (!mongoose.isValidObjectId(_id)) {
    return res.status(422).send({ error: 'Некорректный id локации.' });
  }

  try {
    const location = await Location.findById(_id);

    if (!location) {
      return res.status(404).send({ error: 'Удаление невозможно: локация не существует в базе.' });
    }

    try {
      await fs.unlink(path.join(config.publicPath, `${location.dayImage}`));
    } catch (e) {
      console.log(e);
    }

    try {
      await fs.unlink(path.join(config.publicPath, `${location.schemaImage}`));
    } catch (e) {
      console.log(e);
    }

    const result = await Location.deleteOne({ _id }).populate('city direction region');
    return res.send(result);
  } catch (e) {
    return next(e);
  }
});

locationsRouter.patch('/checked', auth, async (req, res, next) => {
  try {
    if (req.query.allChecked !== undefined) {
      await Location.updateMany({ checked: false });
      return res.send({ patch: false });
    } else if (req.query.checked !== undefined) {
      if (!mongoose.isValidObjectId(req.query.checked)) {
        return res.status(422).send({ error: 'Некорректный id локации.' });
      }

      const locationOne = await Location.findOne({ _id: req.query.checked });

      if (!locationOne) {
        return res.status(404).send({ error: 'Локации не существует в базе.' });
      }

      if (!locationOne.checked) {
        locationOne.checked = req.body.checked;
      } else {
        locationOne.checked = !req.body.checked;
      }

      await locationOne.save();
      return res.sendStatus(204);
    }
  } catch (e) {
    return next(e);
  }
});

locationsRouter.patch('/updateRent/:id', auth, async (req, res, next) => {
  const id = req.params.id;

  if (!mongoose.isValidObjectId(id)) {
    return res.status(422).send({ error: 'Некорректный id локации.' });
  }

  try {
    const rentData: RentData = req.body;

    const location = await Location.findById(id);

    if (!location) {
      return res.status(404).send({ error: 'Данная локация не найдена!' });
    }

    location.rent = rentData.date !== null ? rentData.date : null;
    location.client = rentData.client !== null ? rentData.client : null;
    await location.save();
    await RentHistory.create({
      client: rentData.client,
      location: id,
      rent_date: rentData.date,
      rent_price: location.price,
      rent_cost: mongoose.Types.Decimal128.fromString(rentData.rent_cost),
    });

    await notificationsService.updateRent();

    return res.send(location);
  } catch (e) {
    if (e instanceof mongoose.Error.ValidationError) {
      return res.status(422).send(e);
    }
    return next(e);
  }
});

locationsRouter.patch('/clearRent/:id', auth, async (req, res, next) => {
  const id = req.params.id;

  if (!mongoose.isValidObjectId(id)) {
    return res.status(422).send({ error: 'Некорректный id локации.' });
  }

  try {
    const location = await Location.findById(id);

    if (!location) {
      return res.status(404).send({ error: 'Данная локация не найдена!' });
    }

    location.rent = null;
    location.client = null;
    await location.save();
    const [updatedLocation] = await Location.aggregate([{ $match: { _id: new Types.ObjectId(id) } }, ...flattenLookup]);

    await notificationsService.removeRent(location._id.toString());

    return res.send(updatedLocation);
  } catch (e) {
    if (e instanceof mongoose.Error.ValidationError) {
      return res.status(422).send(e);
    }
    return next(e);
  }
});

export default locationsRouter;

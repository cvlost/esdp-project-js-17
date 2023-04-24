import express from 'express';
import auth from '../middleware/auth';
import Location from '../models/Location';
import mongoose from 'mongoose';
import Region from '../models/Region';
import City from '../models/City';
import Direction from '../models/Direction';

const locationsRouter = express.Router();

locationsRouter.get('/', auth, async (req, res, next) => {
  let perPage = parseInt(req.query.perPage as string);
  let page = parseInt(req.query.page as string);

  page = isNaN(page) || page <= 0 ? 1 : page;
  perPage = isNaN(perPage) || perPage <= 0 ? 10 : perPage;

  try {
    const count = await Location.count();
    let pages = Math.ceil(count / perPage);

    if (pages === 0) pages = 1;
    if (page > pages) page = pages;

    const locations = await Location.aggregate([
      { $skip: (page - 1) * perPage },
      { $limit: perPage },
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
      { $project: { country: 0, description: 0 } },
    ]);

    return res.send({ locations, page, pages, count, perPage });
  } catch (e) {
    return next(e);
  }
});

locationsRouter.get('/:id', auth, async (req, res, next) => {
  const id = req.params.id as string;

  try {
    const location = await Location.findById(id).populate('region city direction');
    return res.send(location);
  } catch (e) {
    return next(e);
  }
});

locationsRouter.post('/', auth, async (req, res, next) => {
  const { address, addressNote, region, city, direction, description } = req.body;
  const dto = { address, addressNote, region, city, direction, description };
  try {
    const locationData = await Location.create(dto);
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
});

locationsRouter.put('/:id', auth, async (req, res, next) => {
  const id = req.params.id as string;
  const { addressNote, region, city, direction, description } = req.body;

  try {
    const location = await Location.findById(id);

    if (!location) {
      return res.status(400).send({ error: 'Редактирование невозможно: локация не существует в базе.' });
    }

    if (region && region !== location.region.toString()) {
      const anotherRegion = await Region.findById(region);
      if (!anotherRegion) {
        return res.status(400).send({ error: 'Редактирование невозможно: неверый id региона.' });
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

    if (direction && direction !== location.city.toString()) {
      const anotherDirection = await Direction.findById(direction);
      if (!anotherDirection) {
        return res.status(400).send({ error: 'Редактирование невозможно: неверый id направления.' });
      }
      location.direction = anotherDirection._id;
    }

    if (typeof addressNote === 'string' && addressNote !== location.addressNote) {
      location.addressNote = addressNote;
    }

    if (typeof description === 'string' && description !== location.description) {
      location.description = description;
    }

    const result = await location.save();
    return res.send(await Location.populate(result, 'direction city region'));
  } catch (e) {
    return next(e);
  }
});

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

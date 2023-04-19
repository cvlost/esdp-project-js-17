import express from 'express';
import auth from '../middleware/auth';
import Location from '../models/Location';
import mongoose from 'mongoose';
import Region from '../models/Region';
import City from '../models/City';
import Direction from '../models/Direction';

const locationsRouter = express.Router();

locationsRouter.get('/', auth, async (req, res, next) => {
  try {
    const locations = await Location.find().populate('region city direction');
    return res.send(locations);
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
    const location = await Location.create(dto);
    return res.send({
      message: 'Новая локация успешно создана!',
      location: await Location.populate(location, 'region direction city'),
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
  const { address, addressNote, region, city, direction, description } = req.body;

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

    if (address && address !== location.address) {
      location.address = address;
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
  const _id = req.params.id as string;

  try {
    const location = await Location.findById(_id);
    if (!location) {
      return res.status(400).send({ error: 'Удаление невозможно: локация не существует в базе.' });
    }

    const result = await Location.deleteOne({ _id }).populate('city direction region');
    return res.send(result);
  } catch (e) {
    return next(e);
  }
});

export default locationsRouter;

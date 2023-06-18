import express from 'express';
import auth from '../middleware/auth';
import City from '../models/City';
import permit from '../middleware/permit';
import mongoose from 'mongoose';
import Location from '../models/Location';
import Street from '../models/Street';
import Region from '../models/Region';

const citiesRouter = express.Router();

citiesRouter.get('/', auth, async (req, res, next) => {
  const areaId = req.query.areaId as string;
  try {
    if (areaId !== undefined) {
      if (!mongoose.isValidObjectId(areaId)) {
        return res.status(422).send({ error: 'Некорректный id области.' });
      }
      const cities = await City.find({ area: areaId });
      return res.send(cities);
    } else {
      const cities = await City.find();
      return res.send(cities);
    }
  } catch (e) {
    return next(e);
  }
});

citiesRouter.get('/:id', auth, async (req, res, next) => {
  try {
    const city = await City.findOne({ _id: req.params.id });
    return res.send(city);
  } catch (e) {
    return next(e);
  }
});

citiesRouter.put('/:id', auth, async (req, res, next) => {
  const edit = {
    name: req.body.name,
    area: req.body.area,
  };
  try {
    const id = req.params.id as string;
    const city = await City.findOne({ _id: req.params.id });
    if (!city) {
      return res.status(404).send({ error: 'City not found!' });
    }
    await City.updateOne({ _id: id }, edit);
    return res.send(city);
  } catch (error) {
    if (error instanceof mongoose.Error.ValidationError) {
      return res.status(400).send(error);
    }
    return next(error);
  }
});

citiesRouter.post('/', auth, permit('admin'), async (req, res, next) => {
  try {
    const city = await City.create({
      area: req.body.area,
      name: req.body.name,
    });

    return res.status(201).send({ message: 'Новый город успешно создан!', city });
  } catch (e) {
    if (e instanceof mongoose.Error.ValidationError) {
      return res.status(422).send(e);
    } else {
      return next(e);
    }
  }
});

citiesRouter.delete('/:id', auth, permit('admin'), async (req, res, next) => {
  const _id = req.params.id as string;

  if (!mongoose.isValidObjectId(_id)) {
    return res.status(422).send({ error: 'Некорректный id города.' });
  }
  try {
    const city = await City.findOne({ _id });
    const location = await Location.findOne({ city: _id });
    const street = await Street.findOne({ city: _id });
    const region = await Region.findOne({ city: _id });
    if (!city) {
      return res.status(404).send({ error: 'Город не существует в базе.' });
    } else if (location || street || region) {
      return res.status(409).send({ error: 'Город привязан к другим сущностям! Удаление запрещено.' });
    }
    const result = await City.deleteOne({ _id });
    return res.send(result);
  } catch (e) {
    return next(e);
  }
});

export default citiesRouter;

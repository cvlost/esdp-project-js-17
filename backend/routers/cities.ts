import express from 'express';
import auth from '../middleware/auth';
import City from '../models/City';
import permit from '../middleware/permit';
import mongoose from 'mongoose';
import Location from '../models/Location';
import Street from '../models/Street';

const citiesRouter = express.Router();

citiesRouter.get('/', auth, async (req, res, next) => {
  try {
    const cities = await City.find();
    return res.send(cities);
  } catch (e) {
    return next(e);
  }
});

citiesRouter.post('/', auth, permit('admin'), async (req, res, next) => {
  try {
    const cityData = await City.create({
      area: req.body.area,
      name: req.body.name,
    });

    return res.send(cityData);
  } catch (e) {
    if (e instanceof mongoose.Error.ValidationError) {
      return res.status(400).send(e);
    } else {
      return next(e);
    }
  }
});

citiesRouter.delete('/:id', auth, permit('admin'), async (req, res, next) => {
  try {
    const _id = req.params.id as string;
    const city = await City.findOne({ _id });
    const location = await Location.find({ city: _id });
    const streets = await Street.find({ city: _id });
    if (!city) {
      return res.status(404).send({ error: 'Город не существует в базе.' });
    } else if (location.length > 0 || streets.length > 0) {
      return res.status(404).send({ error: 'Город привязан к сущностям ! удаление запрещено' });
    }
    const result = await City.deleteOne({ _id });
    return res.send(result);
  } catch (e) {
    return next(e);
  }
});

export default citiesRouter;

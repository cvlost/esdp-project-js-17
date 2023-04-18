import express from 'express';
import auth from '../middleware/auth';
import City from '../models/City';
import permit from '../middleware/permit';
import mongoose from 'mongoose';

const citiesRouter = express.Router();

citiesRouter.get('/', auth, async (req, res) => {
  try {
    const cities = await City.find();
    return res.send(cities);
  } catch {
    return res.sendStatus(500);
  }
});

citiesRouter.post('/', auth, permit('admin'), async (req, res, next) => {
  try {
    const createCity = await City.create({
      name: req.body.name,
    });

    return res.send(createCity);
  } catch (e) {
    if (e instanceof mongoose.Error.ValidationError) {
      return res.status(400).send(e);
    } else {
      return next(e);
    }
  }
});

citiesRouter.delete('/:id', auth, permit('admin'), async (req, res) => {
  try {
    const { id } = req.params;
    await City.deleteOne({ _id: id });
    return res.send({ remove: id });
  } catch {
    return res.sendStatus(500);
  }
});

export default citiesRouter;

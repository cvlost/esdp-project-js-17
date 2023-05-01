import express from 'express';
import auth from '../middleware/auth';
import permit from '../middleware/permit';
import mongoose from 'mongoose';
import Street from '../models/Street';
import Location from '../models/Location';

const streetsRouter = express.Router();

streetsRouter.get('/', auth, async (req, res, next) => {
  try {
    const streets = await Street.find();
    return res.send(streets);
  } catch (e) {
    return next(e);
  }
});

streetsRouter.post('/', auth, permit('admin'), async (req, res, next) => {
  try {
    const streetData = await Street.create({
      city: req.body.city,
      name: req.body.name,
    });

    return res.send(streetData);
  } catch (e) {
    if (e instanceof mongoose.Error.ValidationError) {
      return res.status(400).send(e);
    } else {
      return next(e);
    }
  }
});

streetsRouter.delete('/:id', auth, permit('admin'), async (req, res, next) => {
  try {
    const _id = req.params.id as string;
    const street = await Street.findById(_id);
    const location = await Location.find({ street: _id });
    if (!street) {
      return res.status(404).send({ error: 'Улица не существует в базе.' });
    } else if (location.length > 0) {
      return res.status(404).send({ error: 'Улицы привязаны к локациям ! удаление запрещено' });
    }

    const result = await Street.deleteOne({ _id });
    return res.send(result);
  } catch (e) {
    return next(e);
  }
});

export default streetsRouter;

import express from 'express';
import auth from '../middleware/auth';
import permit from '../middleware/permit';
import mongoose from 'mongoose';
import Street from '../models/Street';
import Location from '../models/Location';

const streetsRouter = express.Router();

streetsRouter.get('/', auth, async (req, res, next) => {
  try {
    if (req.query.citiId !== undefined) {
      const streets = await Street.find({ city: req.query.citiId });
      return res.send(streets);
    } else {
      const streets = await Street.find();
      return res.send(streets);
    }
  } catch (e) {
    return next(e);
  }
});

streetsRouter.get('/:id', auth, async (req, res, next) => {
  try {
    const street = await Street.findOne({ _id: req.params.id });
    return res.send(street);
  } catch (e) {
    return next(e);
  }
});

streetsRouter.put('/:id', auth, async (req, res, next) => {
  const edit = {
    name: req.body.name,
    city: req.body.name,
  };
  try {
    const id = req.params.id as string;
    const street = await Street.find({ _id: req.params.id });
    if (!street) {
      return res.status(404).send({ error: 'street not found!' });
    }
    await Street.updateMany({ _id: id }, edit);
  } catch (error) {
    if (error instanceof mongoose.Error.ValidationError) {
      return res.status(400).send(error);
    }
    return next(error);
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

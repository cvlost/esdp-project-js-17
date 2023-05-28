import express from 'express';
import auth from '../middleware/auth';
import permit from '../middleware/permit';
import Format from '../models/Format';
import mongoose from 'mongoose';
import Location from '../models/Location';

const formatRouter = express.Router();

formatRouter.get('/', auth, permit('admin'), async (req, res, next) => {
  try {
    const formats = await Format.find();
    return res.send(formats);
  } catch (e) {
    return next(e);
  }
});

formatRouter.get('/:id', auth, async (req, res, next) => {
  try {
    const format = await Format.findOne({ _id: req.params.id });
    return res.send(format);
  } catch (e) {
    return next(e);
  }
});

formatRouter.put('/:id', auth, async (req, res, next) => {
  const editFormat = {
    name: req.body.name,
  };
  try {
    const id = req.params.id as string;
    const format = await Format.find({ _id: req.params.id });
    if (!format) {
      return res.status(404).send({ error: 'format not found!' });
    }
    await Format.updateMany({ _id: id }, editFormat);
  } catch (error) {
    if (error instanceof mongoose.Error.ValidationError) {
      return res.status(400).send(error);
    }
    return next(error);
  }
});

formatRouter.post('/', auth, permit('admin'), async (req, res, next) => {
  try {
    const formatData = await Format.create({
      name: req.body.name,
    });

    return res.send(formatData);
  } catch (e) {
    if (e instanceof mongoose.Error.ValidationError) {
      return res.status(400).send(e);
    }
    return next(e);
  }
});

formatRouter.delete('/:id', auth, permit('admin'), async (req, res, next) => {
  try {
    const _id = req.params.id as string;
    const format = await Format.findById(_id);
    const location = await Location.find({ format: _id });
    if (!format) {
      return res.status(404).send({ error: 'Формат не существует в базе.' });
    } else if (location.length > 0) {
      return res.status(404).send({ error: 'Формат привязан к локациям ! удаление запрещено' });
    }

    const result = await Format.deleteOne({ _id });
    return res.send(result);
  } catch (e) {
    return next(e);
  }
});

export default formatRouter;

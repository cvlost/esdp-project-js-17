import express from 'express';
import auth from '../middleware/auth';
import Direction from '../models/Direction';
import permit from '../middleware/permit';
import mongoose from 'mongoose';
import Location from '../models/Location';

const directionRouter = express.Router();

directionRouter.get('/', auth, async (req, res, next) => {
  try {
    const directions = await Direction.find();
    return res.send(directions);
  } catch (e) {
    return next(e);
  }
});

directionRouter.get('/:id', auth, async (req, res, next) => {
  try {
    const dir = await Direction.findOne({ _id: req.params.id });
    return res.send(dir);
  } catch (e) {
    return next(e);
  }
});

directionRouter.put('/:id', auth, async (req, res, next) => {
  const editDir = {
    name: req.body.name,
  };
  const _id = req.params.id as string;

  if (!mongoose.isValidObjectId(_id)) {
    return res.status(422).send({ error: 'Некорректный id направления.' });
  }

  try {
    const dir = await Direction.findById(_id);
    if (!dir) {
      return res.status(404).send({ error: 'Направление не существует в базе.' });
    }
    await Direction.updateOne({ _id }, editDir);
    return res.send(dir);
  } catch (error) {
    if (error instanceof mongoose.Error.ValidationError) {
      return res.status(422).send(error);
    }
    return next(error);
  }
});

directionRouter.post('/', auth, permit('admin'), async (req, res, next) => {
  try {
    const direction = await Direction.create({ name: req.body.name });
    return res.status(201).send({ message: 'Новое направление успешно создано!', direction });
  } catch (e) {
    if (e instanceof mongoose.Error.ValidationError) {
      return res.status(422).send(e);
    } else {
      return next(e);
    }
  }
});

directionRouter.delete('/:id', auth, permit('admin'), async (req, res, next) => {
  const _id = req.params.id as string;
  if (!mongoose.isValidObjectId(_id)) {
    return res.status(422).send({ error: 'Некорректный id направления.' });
  }

  try {
    const direction = await Direction.findOne({ _id });
    const location = await Location.find({ direction: _id });
    if (!direction) {
      return res.status(404).send({ error: 'Направление не существует в базе.' });
    } else if (location.length > 0) {
      return res.status(409).send({ error: 'Направление привязано к локациям! Удаление запрещено.' });
    }
    const result = await Direction.deleteOne({ _id });
    return res.send(result);
  } catch (e) {
    return next(e);
  }
});

export default directionRouter;

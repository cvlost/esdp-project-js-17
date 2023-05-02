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

directionRouter.post('/', auth, permit('admin'), async (req, res, next) => {
  try {
    const directionData = new Direction({
      name: req.body.name,
    });
    await directionData.save();
    return res.send(directionData);
  } catch (e) {
    if (e instanceof mongoose.Error.ValidationError) {
      return res.status(400).send(e);
    } else {
      return next(e);
    }
  }
});

directionRouter.delete('/:id', auth, permit('admin'), async (req, res, next) => {
  try {
    const _id = req.params.id as string;
    const direction = await Direction.findOne({ _id });
    const location = await Location.find({ direction: _id });
    if (!direction) {
      return res.status(404).send({ error: 'Направление не существует в базе.' });
    } else if (location.length > 0) {
      return res.status(404).send({ error: 'Направление привязано к локациям ! удаление запрещено' });
    }
    const result = await Direction.deleteOne({ _id });
    return res.send(result);
  } catch (e) {
    return next(e);
  }
});

export default directionRouter;

import express from 'express';
import auth from '../middleware/auth';
import Lighting from '../models/Lighting';
import permit from '../middleware/permit';
import mongoose from 'mongoose';
import Location from '../models/Location';

const lightingRouter = express.Router();

lightingRouter.get('/', auth, async (req, res, next) => {
  try {
    const lightnings = await Lighting.find();
    return res.send(lightnings);
  } catch (e) {
    return next(e);
  }
});

lightingRouter.get('/:id', auth, async (req, res, next) => {
  try {
    const light = await Lighting.findOne({ _id: req.params.id });
    return res.send(light);
  } catch (e) {
    return next(e);
  }
});

lightingRouter.put('/:id', auth, async (req, res, next) => {
  const edit = {
    name: req.body.name,
  };
  const _id = req.params.id as string;

  if (!mongoose.isValidObjectId(_id)) {
    return res.status(422).send({ error: 'Некорректный id освещения.' });
  }

  try {
    const light = await Lighting.findById(_id);
    if (!light) {
      return res.status(404).send({ error: 'Освещение не существует в базе.' });
    }
    await Lighting.updateOne({ _id }, edit);
    return res.send(light);
  } catch (error) {
    if (error instanceof mongoose.Error.ValidationError) {
      return res.status(422).send(error);
    }
    return next(error);
  }
});

lightingRouter.post('/', auth, permit('admin'), async (req, res, next) => {
  try {
    const lighting = await Lighting.create({ name: req.body.name });
    return res.status(201).send({ message: 'Новое освещение успешно создано!', lighting });
  } catch (e) {
    if (e instanceof mongoose.Error.ValidationError) {
      return res.status(422).send(e);
    } else {
      return next(e);
    }
  }
});

lightingRouter.delete('/:id', auth, permit('admin'), async (req, res, next) => {
  const _id = req.params.id as string;
  if (!mongoose.isValidObjectId(_id)) {
    return res.status(422).send({ error: 'Некорректный id освещения.' });
  }

  try {
    const lighting = await Lighting.findOne({ _id });
    const location = await Location.find({ lighting: _id });
    if (!lighting) {
      return res.status(404).send({ error: 'Освещение не существует в базе.' });
    } else if (location.length > 0) {
      return res.status(409).send({ error: 'Освещение привязано к локациям! Удаление запрещено.' });
    }
    const result = await Lighting.deleteOne({ _id });
    return res.send(result);
  } catch (e) {
    return next(e);
  }
});

export default lightingRouter;

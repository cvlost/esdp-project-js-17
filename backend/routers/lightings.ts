import express from 'express';
import auth from '../middleware/auth';
import Lighting from '../models/Lighting';
import permit from '../middleware/permit';
import mongoose from 'mongoose';
import Location from '../models/Location';

const lightingRouter = express.Router();

lightingRouter.get('/', auth, async (req, res, next) => {
  try {
    const lightings = await Lighting.find();
    return res.send(lightings);
  } catch (e) {
    return next(e);
  }
});

lightingRouter.post('/', auth, permit('admin'), async (req, res, next) => {
  try {
    const lightingData = new Lighting({
      name: req.body.name,
    });
    await lightingData.save();
    return res.send(lightingData);
  } catch (e) {
    if (e instanceof mongoose.Error.ValidationError) {
      return res.status(400).send(e);
    } else {
      return next(e);
    }
  }
});

lightingRouter.delete('/:id', auth, permit('admin'), async (req, res, next) => {
  try {
    const _id = req.params.id as string;
    const lighting = await Lighting.findOne({ _id });
    const location = await Location.find({ lighting: _id });
    if (!lighting) {
      return res.status(404).send({ error: 'Данное освещение не существует в базе.' });
    } else if (location.length > 0) {
      return res.status(404).send({ error: 'Освещение привязано к локациям ! Удаление запрещено!' });
    }
    const result = await Lighting.deleteOne({ _id });
    return res.send(result);
  } catch (e) {
    return next(e);
  }
});

export default lightingRouter;

import express from 'express';
import auth from '../middleware/auth';
import Region from '../models/Region';
import permit from '../middleware/permit';
import mongoose from 'mongoose';

const regionsRouter = express.Router();

regionsRouter.get('/', auth, async (req, res, next) => {
  try {
    const regions = await Region.find();
    return res.send(regions);
  } catch (e) {
    return next(e);
  }
});

regionsRouter.post('/', auth, permit('admin'), async (req, res, next) => {
  try {
    const regionData = await Region.create({
      name: req.body.name,
    });

    return res.send(regionData);
  } catch (e) {
    if (e instanceof mongoose.Error.ValidationError) {
      return res.status(400).send(e);
    } else {
      return next(e);
    }
  }
});

regionsRouter.delete('/:id', auth, permit('admin'), async (req, res, next) => {
  try {
    const _id = req.params.id as string;
    const region = await Region.findById(_id);
    if (!region) {
      return res.status(404).send({ error: 'Район не существует в базе.' });
    }

    const result = await Region.deleteOne({ _id });
    return res.send(result);
  } catch (e) {
    return next(e);
  }
});

export default regionsRouter;

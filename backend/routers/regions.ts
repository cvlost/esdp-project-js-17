import express from 'express';
import auth from '../middleware/auth';
import Region from '../models/Region';
import permit from '../middleware/permit';
import mongoose from 'mongoose';
import Location from '../models/Location';

const regionsRouter = express.Router();

regionsRouter.get('/', auth, async (req, res, next) => {
  try {
    if (req.query.cityId !== undefined) {
      const regions = await Region.find({ city: req.query.cityId });
      return res.send(regions);
    } else {
      const regions = await Region.find();
      return res.send(regions);
    }
  } catch (e) {
    return next(e);
  }
});

regionsRouter.get('/:id', auth, async (req, res, next) => {
  try {
    const region = await Region.find({ _id: req.params.id });
    return res.send(region);
  } catch (e) {
    return next(e);
  }
});

regionsRouter.put('/:id', auth, async (req, res, next) => {
  const edit = {
    name: req.body.name,
    city: req.body.city,
  };
  try {
    const id = req.params.id as string;
    const region = await Region.find({ _id: req.params.id });
    if (!region) {
      return res.status(404).send({ error: 'region not found!' });
    }
    await Region.updateMany({ _id: id }, edit);
  } catch (error) {
    if (error instanceof mongoose.Error.ValidationError) {
      return res.status(400).send(error);
    }
    return next(error);
  }
});

regionsRouter.post('/', auth, permit('admin'), async (req, res, next) => {
  try {
    const regionData = await Region.create({
      name: req.body.name,
      city: req.body.city,
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
    const location = await Location.find({ region: _id });
    if (!region) {
      return res.status(404).send({ error: 'Район не существует в базе.' });
    } else if (location.length > 0) {
      return res.status(404).send({ error: 'Регион привязан к локациям ! удаление запрещено' });
    }

    const result = await Region.deleteOne({ _id });
    return res.send(result);
  } catch (e) {
    return next(e);
  }
});

export default regionsRouter;

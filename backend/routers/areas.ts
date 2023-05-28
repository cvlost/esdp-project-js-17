import express from 'express';
import auth from '../middleware/auth';
import Area from '../models/Area';
import permit from '../middleware/permit';
import mongoose from 'mongoose';
import Location from '../models/Location';
import City from '../models/City';

const areasRouter = express.Router();

areasRouter.get('/', auth, async (req, res, next) => {
  try {
    const areas = await Area.find();
    return res.send(areas);
  } catch (e) {
    return next(e);
  }
});

areasRouter.get('/:id', auth, async (req, res, next) => {
  try {
    const area = await Area.findOne({ _id: req.params.id });
    return res.send(area);
  } catch (e) {
    return next(e);
  }
});

areasRouter.put('/:id', auth, async (req, res, next) => {
  const editArea = {
    name: req.body.name,
  };
  try {
    const id = req.params.id as string;
    const area = await Area.find({ _id: id });
    if (!area) {
      return res.status(404).send({ error: 'area not found!' });
    }
    await Area.updateOne({ _id: id, name: editArea.name });
    return res.send(area);
  } catch (error) {
    if (error instanceof mongoose.Error.ValidationError) {
      return res.status(400).send(error);
    }
    return next(error);
  }
});

areasRouter.post('/', auth, permit('admin'), async (req, res, next) => {
  try {
    const areaData = await Area.create({
      name: req.body.name,
    });

    return res.send(areaData);
  } catch (e) {
    if (e instanceof mongoose.Error.ValidationError) {
      return res.status(400).send(e);
    } else {
      return next(e);
    }
  }
});

areasRouter.delete('/:id', auth, permit('admin'), async (req, res, next) => {
  try {
    const _id = req.params.id as string;
    const area = await Area.findOne({ _id });
    const location = await Location.find({ area: _id });
    const cities = await City.find({ area: _id });
    if (!area) {
      return res.status(404).send({ error: 'Область не существует в базе.' });
    } else if (location.length > 0 || cities.length > 0) {
      return res.status(404).send({ error: 'Область привязана к другим сущностям ! удаление запрещено' });
    }
    const result = await Area.deleteOne({ _id });
    return res.send(result);
  } catch (e) {
    return next(e);
  }
});

export default areasRouter;

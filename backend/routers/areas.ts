import express from 'express';
import auth from '../middleware/auth';
import Area from '../models/Area';
import permit from '../middleware/permit';
import mongoose from 'mongoose';

const areasRouter = express.Router();

areasRouter.get('/', auth, async (req, res, next) => {
  try {
    const areas = await Area.find();
    return res.send(areas);
  } catch (e) {
    return next(e);
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
    if (!area) {
      return res.status(404).send({ error: 'Область не существует в базе.' });
    }
    const result = await Area.deleteOne({ _id });
    return res.send(result);
  } catch (e) {
    return next(e);
  }
});

export default areasRouter;

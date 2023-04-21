import express from 'express';
import auth from '../middleware/auth';
import Area from '../models/Area';
import permit from '../middleware/permit';
import mongoose from 'mongoose';

const areasRouter = express.Router();

areasRouter.get('/', auth, async (req, res) => {
  try {
    const areas = await Area.find();
    return res.send(areas);
  } catch {
    return res.sendStatus(500);
  }
});

areasRouter.post('/', auth, permit('admin'), async (req, res, next) => {
  try {
    const createArea = await Area.create({
      name: req.body.name,
    });

    return res.send(createArea);
  } catch (e) {
    if (e instanceof mongoose.Error.ValidationError) {
      return res.status(400).send(e);
    } else {
      return next(e);
    }
  }
});

areasRouter.delete('/:id', auth, permit('admin'), async (req, res) => {
  try {
    const { id } = req.params;
    await Area.deleteOne({ _id: id });
    return res.send({ remove: id });
  } catch {
    return res.sendStatus(500);
  }
});

export default areasRouter;

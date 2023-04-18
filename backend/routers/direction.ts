import express from 'express';
import auth from '../middleware/auth';
import Direction from '../models/Direction';
import { DirectionType } from '../types';
import permit from '../middleware/permit';

const directionRouter = express.Router();

directionRouter.get('/', auth, async (req, res, next) => {
  try {
    const directions: DirectionType[] = await Direction.find();
    return res.send(directions);
  } catch (e) {
    return next(e);
  }
});

directionRouter.post('/', auth, permit('admin'), async (req, res, next) => {
  const directionData = new Direction({
    name: req.body.name,
  });

  try {
    await directionData.save();
    return res.send(directionData);
  } catch (e) {
    return next(e);
  }
});

directionRouter.delete('/:id', auth, permit('admin'), async (req, res, next) => {
  try {
    const direction = await Direction.findOne({ _id: req.params.id });
    if (!direction) {
      return res.status(404).send({ Error: 'Unknown direction' });
    }
    const deletedDirection = await Direction.deleteOne({ _id: req.params.id });
    return res.send(deletedDirection);
  } catch (e) {
    return next(e);
  }
});

export default directionRouter;

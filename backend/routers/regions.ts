import express from 'express';
import auth from '../middleware/auth';
import Region from '../models/Region';
import permit from '../middleware/permit';
import mongoose from 'mongoose';

const regionsRouter = express.Router();

regionsRouter.get('/', auth, async (req, res) => {
  try {
    const regions = await Region.find();
    return res.send(regions);
  } catch {
    return res.sendStatus(500);
  }
});

regionsRouter.post('/', auth, permit('admin'), async (req, res, next) => {
  try {
    const createRegion = await Region.create({
      name: req.body.name,
    });

    return res.send(createRegion);
  } catch (e) {
    if (e instanceof mongoose.Error.ValidationError) {
      return res.status(400).send(e);
    } else {
      return next(e);
    }
  }
});

export default regionsRouter;

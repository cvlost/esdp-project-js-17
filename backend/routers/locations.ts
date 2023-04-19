import express from 'express';
import auth from '../middleware/auth';
import Location from '../models/Location';

const locationsRouter = express.Router();

locationsRouter.get('/', auth, async (req, res, next) => {
  try {
    const locations = await Location.find().populate('region city direction');
    return res.send(locations);
  } catch (e) {
    return next(e);
  }
});

export default locationsRouter;

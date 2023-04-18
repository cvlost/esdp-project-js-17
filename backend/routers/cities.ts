import express from 'express';
import auth from '../middleware/auth';
import City from '../models/City';

const citiesRouter = express.Router();

citiesRouter.get('/', auth, async (req, res) => {
  try {
    const cities = await City.find();
    return res.send(cities);
  } catch {
    return res.sendStatus(500);
  }
});

export default citiesRouter;

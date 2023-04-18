import express from 'express';
import auth from '../middleware/auth';
import Region from '../models/Region';

const regionsRouter = express.Router();

regionsRouter.get('/', auth, async (req, res) => {
  try {
    const regions = await Region.find();
    return res.send(regions);
  } catch {
    return res.sendStatus(500);
  }
});

export default regionsRouter;

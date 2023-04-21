import express from 'express';
import auth from '../middleware/auth';
import Area from '../models/Area';

const areasRouter = express.Router();

areasRouter.get('/', auth, async (req, res) => {
  try {
    const areas = await Area.find();
    return res.send(areas);
  } catch {
    return res.sendStatus(500);
  }
});

export default areasRouter;

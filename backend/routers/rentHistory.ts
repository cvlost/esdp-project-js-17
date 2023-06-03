import express from 'express';
import Booking from '../models/Booking';
import Location from '../models/Location';
import auth from '../middleware/auth';
import RentHistory from '../models/RentHistory';

const rentHistoryRouter = express.Router();

rentHistoryRouter.get('/', async (req, res, next) => {
  try {
    const rentHistory = await RentHistory.find();
    return res.send(rentHistory);
  } catch (e) {
    return next(e);
  }
});

rentHistoryRouter.get('/:id', async (req, res, next) => {
  try {
    const id = req.params.id;
    const rentHistory = await RentHistory.find({ location_id: id });
    return res.send(rentHistory);
  } catch (e) {
    return next(e);
  }
});

rentHistoryRouter.delete('/:id', auth, async (req, res, next) => {
  try {
    const id = req.params.id;
    await RentHistory.deleteOne({ _id: id });

    return res.status(204).send({ message: 'Данная история удалена' });
  } catch (e) {
    return next(e);
  }
});

export default rentHistoryRouter;

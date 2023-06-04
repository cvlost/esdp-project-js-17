import express from 'express';
import auth from '../middleware/auth';
import RentHistory from '../models/RentHistory';
import Location from '../models/Location';
import { Types } from 'mongoose';
import { flattenLookup } from './locations';

const rentHistoryRouter = express.Router();

rentHistoryRouter.get('/', auth, async (req, res, next) => {
  try {
    const rentHistory = await RentHistory.find().sort({ createdAt: -1 }).populate('location').populate('client');
    return res.send(rentHistory);
  } catch (e) {
    return next(e);
  }
});

rentHistoryRouter.get('/:id', auth, async (req, res, next) => {
  try {
    const id = req.params.id;
    const [location] = await Location.aggregate([{ $match: { _id: new Types.ObjectId(id) } }, ...flattenLookup]);
    const rentHistory = await RentHistory.aggregate([
      { $match: { location: new Types.ObjectId(id) } },
      { $sort: { createdAt: -1 } },
      {
        $addFields: {
          price: {
            $convert: {
              input: { $toDecimal: '$price' },
              to: 'string',
            },
          },
        },
      },
      {
        $lookup: {
          from: 'clients',
          localField: 'client',
          foreignField: '_id',
          as: 'client',
        },
      },
      {
        $unwind: '$client',
      },
    ]);

    const rentHistoryToSend = rentHistory.map((item) => {
      const { ...rest } = item;
      return {
        ...rest,
        location: location,
      };
    });
    return res.send(rentHistoryToSend);
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

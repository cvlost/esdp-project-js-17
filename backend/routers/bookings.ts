import express from 'express';
import Booking from '../models/Booking';
import Location from '../models/Location';
import mongoose from 'mongoose';
import auth from '../middleware/auth';
import dayjs from 'dayjs';
import { BookingListType } from '../types';

const bookingsRouter = express.Router();

bookingsRouter.get('/:id', auth, async (req, res, next) => {
  if (!mongoose.isValidObjectId(req.params.id)) {
    return res.status(422).send({ error: 'Некорректный id брони.' });
  }
  try {
    const locationId = req.params.id;
    const location = await Location.findOne({ _id: locationId }).select('price');
    return res.send(location);
  } catch (e) {
    return next(e);
  }
});

bookingsRouter.post('/', auth, async (req, res, next) => {
  try {
    const data = {
      clientId: req.body.clientId,
      locationId: req.body.locationId,
      booking_date: req.body.booking_date,
    };

    const bookingList: BookingListType[] = await Booking.find({ locationId: data.locationId });

    const date = {
      end: dayjs(data.booking_date.end).format('DD/MM/YYYY'),
      start: dayjs(data.booking_date.start).format('DD/MM/YYYY'),
    };

    const isError = bookingList.some((item) => {
      const dateLoc = {
        end: dayjs(item.booking_date.end).format('DD/MM/YYYY'),
        start: dayjs(item.booking_date.start).format('DD/MM/YYYY'),
      };

      return date.end === dateLoc.end && date.start === dateLoc.start;
    });

    if (isError) {
      return res.status(400).send({ message: 'Перид занят !' });
    }

    const create = await Booking.create(data);
    await Location.updateOne({ _id: req.body.locationId }, { $push: { booking: create._id } });
    return res.send(create);
  } catch (e) {
    if (e instanceof mongoose.Error.ValidationError) {
      return res.status(400).send(e);
    }
    return next(e);
  }
});

bookingsRouter.delete('/:loc/:book', auth, async (req, res) => {
  const locId = req.params.loc as string;
  const bookId = req.params.book as string;
  try {
    const locationOne = await Location.findOne({ _id: locId });
    if (!locationOne) {
      return res.status(404).send({ error: 'Данной локации нет ' });
    }
    await Booking.deleteOne({ _id: bookId });
    await Location.updateOne({ _id: locId }, { $pull: { booking: bookId } });
    return res.send({ removeLoc: locId, removeBook: bookId });
  } catch (e) {
    return res.sendStatus(500);
  }
});

export default bookingsRouter;

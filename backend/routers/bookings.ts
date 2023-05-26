import express from 'express';
import Booking from '../models/Booking';
import Location from '../models/Location';
import mongoose from 'mongoose';
import auth from '../middleware/auth';

const bookingsRouter = express.Router();

bookingsRouter.post('/', auth, async (req, res, next) => {
  try {
    const create = await Booking.create({
      clientId: req.body.clientId,
      locationId: req.body.locationId,
      booking_date: req.body.booking_date,
    });

    await Location.updateOne({ _id: req.body.locationId }, { $push: { booking: create._id } });

    return res.send(create);
  } catch (e) {
    if (e instanceof mongoose.Error.ValidationError) {
      return res.status(400).send(e);
    }
    return next(e);
  }
});

bookingsRouter.get('/:id', async (req, res) => {
  try {
    const bookingListLocation = await Location.findOne({ _id: req.params.id }).populate('booking');
    return res.send(bookingListLocation);
  } catch (e) {
    return res.sendStatus(500);
  }
});

export default bookingsRouter;

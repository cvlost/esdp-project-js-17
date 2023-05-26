import express from 'express';
import Booking from '../models/Booking';
import Location from '../models/Location';
import mongoose from 'mongoose';

const bookingsRouter = express.Router();

bookingsRouter.post('/', async (req, res, next) => {
  try {
    console.log(req.body);

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

export default bookingsRouter;

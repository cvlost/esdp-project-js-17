import express from 'express';
import Booking from '../models/Booking';
import Location from '../models/Location';

const bookingsRouter = express.Router();

bookingsRouter.post('/', async (req, res) => {
  try {
    const create = await Booking.create({
      clientId: req.body.clientId,
      locationId: req.body.locationId,
      booking_date: req.body.booking_date,
    });

    await Location.updateOne({ _id: req.body.locationId }, { $push: { booking: create._id } });

    return res.send(create);
  } catch (e) {
    return res.sendStatus(500);
  }
});

export default bookingsRouter;

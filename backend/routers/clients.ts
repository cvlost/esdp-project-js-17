import express from 'express';
import auth from '../middleware/auth';
import Client from '../models/Client';
import mongoose from 'mongoose';

const clientsRouter = express.Router();

clientsRouter.post('/clients', auth, async (req, res, next) => {
  try {
    const clientData = await Client.create({
      name: req.body.name,
      email: req.body.email,
      phone: req.body.phone,
    });
    return res.send(clientData);
  } catch (error) {
    if (error instanceof mongoose.Error.ValidationError) {
      return res.status(400).send(error);
    }
    return next(error);
  }
});

export default clientsRouter;

import express from 'express';
import auth from '../middleware/auth';
import Client from '../models/Client';
import mongoose from 'mongoose';

const clientsRouter = express.Router();

clientsRouter.post('/', auth, async (req, res, next) => {
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

clientsRouter.get('/', auth, async (req, res, next) => {
  try {
    const clients = await Client.find().sort({ _id: -1 });
    return res.send(clients);
  } catch (e) {
    return next(e);
  }
});

clientsRouter.get('/:id', auth, async (req, res, next) => {
  try {
    const client = await Client.findOne({ _id: req.params.id });
    return res.send(client);
  } catch (e) {
    return next(e);
  }
});

clientsRouter.put('/:id', auth, async (req, res, next) => {
  try {
    const id = req.params.id as string;
    const { email, name, phone } = req.body;
    const client = await Client.findById(id);

    if (!client) {
      return res.status(404).send({ error: 'client not found!' });
    }

    if (email && email !== client.email) {
      client.email = email;
    }
    if (name && name !== client.name) {
      client.name = name;
    }
    if (phone && phone !== client.phone) {
      client.phone = phone;
    }

    const result = await client.save();

    return res.send(result);
  } catch (error) {
    if (error instanceof mongoose.Error.ValidationError) {
      return res.status(400).send(error);
    }
    return next(error);
  }
});

clientsRouter.delete('/:id', auth, async (req, res, next) => {
  try {
    const client = await Client.findOne({ _id: req.params.id });
    if (!client) {
      return res.send({ error: 'client is not found!' });
    }

    const deletedClient = await Client.deleteOne({ _id: req.params.id });
    return res.send(deletedClient);
  } catch (e) {
    return next(e);
  }
});

export default clientsRouter;

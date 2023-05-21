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
  let page = parseInt(req.query.page as string);
  let perPage = parseInt(req.query.perPage as string);

  page = isNaN(page) || page <= 0 ? 1 : page;
  perPage = isNaN(perPage) || perPage <= 0 ? 10 : perPage;

  try {
    const count = await Client.count();
    let pages = Math.ceil(count / perPage);
    if (pages === 0) pages = 1;
    if (page > pages) page = pages;
    const clients = await Client.find()
      .skip((page - 1) * perPage)
      .limit(perPage);

    return res.send({ clients, page, pages, count, perPage });
  } catch (e) {
    return next(e);
  }
});

export default clientsRouter;

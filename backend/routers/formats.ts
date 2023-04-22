import express from 'express';
import auth from '../middleware/auth';
import permit from '../middleware/permit';
import Format from '../models/Format';
import mongoose from 'mongoose';

const formatRouter = express.Router();

formatRouter.get('/', auth, permit('admin'), async (req, res, next) => {
  try {
    const formats = await Format.find();
    return res.send(formats);
  } catch (e) {
    return next(e);
  }
});

formatRouter.post('/', auth, permit('admin'), async (req, res, next) => {
  try {
    const formatData = await Format.create({
      name: req.body.name,
    });

    return res.send(formatData);
  } catch (e) {
    if (e instanceof mongoose.Error.ValidationError) {
      return res.status(400).send(e);
    }
    return next(e);
  }
});

formatRouter.delete('/:id', auth, permit('admin'), async (req, res, next) => {
  try {
    const { _id } = req.params;
    const format = await Format.findById(_id);
    if (!format) {
      return res.status(404).send({ error: 'Формат не существует в базе.' });
    }

    const result = await Format.deleteOne({ _id });
    return res.send(result);
  } catch (e) {
    return next(e);
  }
});

export default formatRouter;

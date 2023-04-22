import express from 'express';
import auth from '../middleware/auth';
import { FormatType } from '../types';
import permit from '../middleware/permit';
import Format from '../models/Format';
import mongoose from 'mongoose';

const formatRouter = express.Router();

formatRouter.get('/', auth, permit('admin'), async (req, res, next) => {
  try {
    const formats: FormatType[] = await Format.find();
    return res.send(formats);
  } catch (e) {
    return next(e);
  }
});

formatRouter.post('/', auth, permit('admin'), async (req, res, next) => {
  try {
    const newFormat = await Format.create({
      name: req.body.name,
    });

    return res.send(newFormat);
  } catch (e) {
    if (e instanceof mongoose.Error.ValidationError) {
      return res.status(400).send(e);
    }
    return next(e);
  }
});

formatRouter.delete('/:id', auth, permit('admin'), async (req, res, next) => {
  try {
    const { id } = req.params;
    await Format.deleteOne({ _id: id });
    return res.send({ remove: id });
  } catch (e) {
    return next(e);
  }
});

export default formatRouter;

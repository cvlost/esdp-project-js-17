import express from 'express';
import auth from '../middleware/auth';
import Size from '../models/Size';
import permit from '../middleware/permit';
import mongoose from 'mongoose';
import Location from '../models/Location';

const sizesRouter = express.Router();

sizesRouter.get('/', auth, async (req, res, next) => {
  try {
    const sizes = await Size.find();
    return res.send(sizes);
  } catch (e) {
    return next(e);
  }
});

sizesRouter.get('/:id', auth, async (req, res, next) => {
  try {
    const size = await Size.findOne({ _id: req.params.id });
    return res.send(size);
  } catch (e) {
    return next(e);
  }
});

sizesRouter.put('/:id', auth, async (req, res, next) => {
  const edit = {
    name: req.body.name,
  };
  try {
    const id = req.params.id as string;
    const size = await Size.find({ _id: req.params.id });
    if (!size) {
      return res.status(404).send({ error: 'size not found!' });
    }
    await Size.updateMany({ _id: id }, edit);
  } catch (error) {
    if (error instanceof mongoose.Error.ValidationError) {
      return res.status(400).send(error);
    }
    return next(error);
  }
});

sizesRouter.post('/', auth, permit('admin'), async (req, res, next) => {
  try {
    const sizeData = new Size({
      name: req.body.name,
    });
    await sizeData.save();
    return res.send(sizeData);
  } catch (e) {
    if (e instanceof mongoose.Error.ValidationError) {
      return res.status(400).send(e);
    } else {
      return next(e);
    }
  }
});

sizesRouter.delete('/:id', auth, permit('admin'), async (req, res, next) => {
  try {
    const _id = req.params.id as string;
    const size = await Size.findOne({ _id });
    const location = await Location.find({ size: _id });
    if (!size) {
      return res.status(404).send({ error: 'Данный размер не существует в базе.' });
    } else if (location.length > 0) {
      return res.status(404).send({ error: 'Данный размер привязан к локациям ! Удаление запрещено' });
    }
    const result = await Size.deleteOne({ _id });
    return res.send(result);
  } catch (e) {
    return next(e);
  }
});

export default sizesRouter;

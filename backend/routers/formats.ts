import express from 'express';
import auth from '../middleware/auth';
import permit from '../middleware/permit';
import Format from '../models/Format';
import mongoose from 'mongoose';
import Location from '../models/Location';

const formatRouter = express.Router();

formatRouter.get('/', auth, async (req, res, next) => {
  try {
    const formats = await Format.find();
    return res.send(formats);
  } catch (e) {
    return next(e);
  }
});

formatRouter.post('/', auth, permit('admin'), async (req, res, next) => {
  try {
    const format = await Format.create({ name: req.body.name });

    return res.status(201).send({ message: 'Новый формат успешно создан!', format });
  } catch (e) {
    if (e instanceof mongoose.Error.ValidationError) {
      return res.status(422).send(e);
    }
    return next(e);
  }
});

formatRouter.delete('/:id', auth, permit('admin'), async (req, res, next) => {
  const _id = req.params.id as string;

  if (!mongoose.isValidObjectId(_id)) {
    return res.status(422).send({ error: 'Некорректный id формата.' });
  }

  try {
    const format = await Format.findById(_id);
    const location = await Location.find({ format: _id });
    if (!format) {
      return res.status(404).send({ error: 'Формат не существует в базе.' });
    } else if (location.length > 0) {
      return res.status(409).send({ error: 'Формат привязан к локациям! Удаление запрещено.' });
    }

    const result = await Format.deleteOne({ _id });
    return res.send(result);
  } catch (e) {
    return next(e);
  }
});

export default formatRouter;

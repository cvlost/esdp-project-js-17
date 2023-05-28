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

sizesRouter.post('/', auth, permit('admin'), async (req, res, next) => {
  try {
    const sizeData = new Size({
      name: req.body.name,
    });
    await sizeData.save();
    return res.status(201).send({ message: 'Новый размер успешно создан!', size: sizeData });
  } catch (e) {
    if (e instanceof mongoose.Error.ValidationError) {
      return res.status(422).send(e);
    } else {
      return next(e);
    }
  }
});

sizesRouter.delete('/:id', auth, permit('admin'), async (req, res, next) => {
  const _id = req.params.id as string;

  if (!mongoose.isValidObjectId(_id)) {
    return res.status(422).send({ error: 'Некорректный id размера.' });
  }

  try {
    const size = await Size.findOne({ _id });
    const location = await Location.find({ size: _id });
    if (!size) {
      return res.status(404).send({ error: 'Данный размер не существует в базе.' });
    } else if (location.length > 0) {
      return res.status(409).send({ error: 'Данный размер привязан к локациям! Удаление запрещено.' });
    }
    const result = await Size.deleteOne({ _id });
    return res.send(result);
  } catch (e) {
    return next(e);
  }
});

export default sizesRouter;

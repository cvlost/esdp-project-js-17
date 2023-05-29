import express from 'express';
import auth from '../middleware/auth';
import permit from '../middleware/permit';
import mongoose from 'mongoose';
import Street from '../models/Street';
import Location from '../models/Location';

const streetsRouter = express.Router();

streetsRouter.get('/', auth, async (req, res, next) => {
  const cityId = req.query.cityId as string;

  try {
    if (cityId !== undefined) {
      if (!mongoose.isValidObjectId(cityId)) {
        return res.status(422).send({ error: 'Некорректный id города.' });
      }

      const streets = await Street.find({ city: cityId });
      return res.send(streets);
    } else {
      const streets = await Street.find();
      return res.send(streets);
    }
  } catch (e) {
    return next(e);
  }
});

streetsRouter.post('/', auth, permit('admin'), async (req, res, next) => {
  try {
    const street = await Street.create({
      city: req.body.city,
      name: req.body.name,
    });

    return res.status(201).send({ message: 'Новая улица успешно создана!', street });
  } catch (e) {
    if (e instanceof mongoose.Error.ValidationError) {
      return res.status(422).send(e);
    } else {
      return next(e);
    }
  }
});

streetsRouter.delete('/:id', auth, permit('admin'), async (req, res, next) => {
  const _id = req.params.id as string;

  if (!mongoose.isValidObjectId(_id)) {
    return res.status(422).send({ error: 'Некорректный id улицы.' });
  }

  try {
    const street = await Street.findById(_id);
    const location = await Location.findOne({ streets: { $in: [_id] } });
    if (!street) {
      return res.status(404).send({ error: 'Улица не существует в базе.' });
    } else if (location) {
      return res.status(409).send({ error: 'Улица привязана к локациям! Удаление запрещено.' });
    }

    const result = await Street.deleteOne({ _id });
    return res.send(result);
  } catch (e) {
    return next(e);
  }
});

export default streetsRouter;

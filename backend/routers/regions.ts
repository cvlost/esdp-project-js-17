import express from 'express';
import auth from '../middleware/auth';
import Region from '../models/Region';
import permit from '../middleware/permit';
import mongoose from 'mongoose';
import Location from '../models/Location';

const regionsRouter = express.Router();

regionsRouter.get('/', auth, async (req, res, next) => {
  const cityId = req.query.cityId;

  try {
    if (cityId !== undefined) {
      if (!mongoose.isValidObjectId(cityId)) {
        return res.status(422).send({ error: 'Некорректный id города.' });
      }

      const regions = await Region.find({ city: cityId });
      return res.send(regions);
    } else {
      const regions = await Region.find();
      return res.send(regions);
    }
  } catch (e) {
    return next(e);
  }
});

regionsRouter.post('/', auth, permit('admin'), async (req, res, next) => {
  try {
    const region = await Region.create({
      name: req.body.name,
      city: req.body.city,
    });

    return res.status(201).send({ message: 'Новый район успешно создан!', region });
  } catch (e) {
    if (e instanceof mongoose.Error.ValidationError) {
      return res.status(422).send(e);
    } else {
      return next(e);
    }
  }
});

regionsRouter.delete('/:id', auth, permit('admin'), async (req, res, next) => {
  const _id = req.params.id as string;

  if (!mongoose.isValidObjectId(_id)) {
    return res.status(422).send({ error: 'Некорректный id района.' });
  }

  try {
    const region = await Region.findById(_id);
    const location = await Location.find({ region: _id });
    if (!region) {
      return res.status(404).send({ error: 'Район не существует в базе.' });
    } else if (location.length > 0) {
      return res.status(409).send({ error: 'Район привязан к локациям! Удаление запрещено.' });
    }

    const result = await Region.deleteOne({ _id });
    return res.send(result);
  } catch (e) {
    return next(e);
  }
});

export default regionsRouter;

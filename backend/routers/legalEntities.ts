import express from 'express';
import auth from '../middleware/auth';
import permit from '../middleware/permit';
import mongoose from 'mongoose';
import LegalEntity from '../models/LegalEntity';
import Location from '../models/Location';

const legalEntitiesRouter = express.Router();

legalEntitiesRouter.get('/', auth, async (req, res, next) => {
  try {
    const items = await LegalEntity.find();
    return res.send(items);
  } catch (e) {
    return next(e);
  }
});

legalEntitiesRouter.get('/:id', auth, async (req, res, next) => {
  const _id = req.params.id;
  if (!mongoose.isValidObjectId(_id)) {
    return res.status(422).send({ error: 'Некорректный id юридического лица.' });
  }
  try {
    const legalEntity = await LegalEntity.findOne({ _id });
    if (!legalEntity) {
      return res.status(404).send({ error: 'Такое юридическое лицо не существует в базе.' });
    }
    return res.send(legalEntity);
  } catch (e) {
    return next(e);
  }
});

legalEntitiesRouter.post('/', auth, permit('admin'), async (req, res, next) => {
  try {
    const legalEntity = await LegalEntity.create({
      name: req.body.name,
    });

    return res.status(201).send({ message: 'Новое юридическое лицо успешно создано!', legalEntity });
  } catch (e) {
    if (e instanceof mongoose.Error.ValidationError) {
      return res.status(422).send(e);
    } else {
      return next(e);
    }
  }
});

legalEntitiesRouter.put('/:id', auth, permit('admin'), async (req, res, next) => {
  const _id = req.params.id as string;
  if (!mongoose.isValidObjectId(_id)) {
    return res.status(422).send({ error: 'Некорректный id юридического лица.' });
  }

  try {
    const legalEntity = await LegalEntity.findById(_id);
    if (!legalEntity) {
      return res.status(404).send({ error: 'Юридическое лицо не существует в базе.' });
    }
    const { name } = req.body;
    if (name !== legalEntity.name) {
      legalEntity.name = name;
    }
    const result = await legalEntity.save();
    return res.send(result);
  } catch (error) {
    if (error instanceof mongoose.Error.ValidationError) {
      return res.status(422).send(error);
    }
    return next(error);
  }
});

legalEntitiesRouter.delete('/:id', auth, permit('admin'), async (req, res, next) => {
  const _id = req.params.id as string;
  if (!mongoose.isValidObjectId(_id)) {
    return res.status(422).send({ error: 'Некорректный id юридического лица.' });
  }
  try {
    const legalEntity = await LegalEntity.findById(_id);
    const location = await Location.find({ legalEntity: _id });
    if (!legalEntity) {
      return res.status(404).send({ error: 'Юридическое лицо не существует в базе.' });
    } else if (location.length > 0) {
      return res.status(409).send({ error: 'Юр лицо привязано к локациям! Удаление запрещено.' });
    }
    const result = await LegalEntity.deleteOne({ _id });
    return res.send(result);
  } catch (e) {
    return next(e);
  }
});

export default legalEntitiesRouter;

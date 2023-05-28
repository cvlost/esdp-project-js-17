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
  try {
    const legalEntity = await LegalEntity.findOne({ _id: req.params.id });
    return res.send(legalEntity);
  } catch (e) {
    return next(e);
  }
});

legalEntitiesRouter.put('/:id', auth, async (req, res, next) => {
  const edit = {
    name: req.body.name,
  };
  try {
    const id = req.params.id as string;
    const LE = await LegalEntity.find({ _id: req.params.id });
    if (!LE) {
      return res.status(404).send({ error: 'legal Entity not found!' });
    }
    await LegalEntity.updateMany({ _id: id }, edit);
  } catch (error) {
    if (error instanceof mongoose.Error.ValidationError) {
      return res.status(400).send(error);
    }
    return next(error);
  }
});

legalEntitiesRouter.post('/', auth, permit('admin'), async (req, res, next) => {
  try {
    const legalEntityData = await LegalEntity.create({
      name: req.body.name,
    });

    return res.send(legalEntityData);
  } catch (e) {
    if (e instanceof mongoose.Error.ValidationError) {
      return res.status(400).send(e);
    } else {
      return next(e);
    }
  }
});

legalEntitiesRouter.put('/:id', auth, permit('admin'), async (req, res, next) => {
  try {
    const _id = req.params.id as string;
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
      return res.status(400).send(error);
    }
    return next(error);
  }
});

legalEntitiesRouter.delete('/:id', auth, permit('admin'), async (req, res, next) => {
  try {
    const _id = req.params.id as string;
    const legalEntity = await LegalEntity.findById(_id);
    const location = await Location.find({ legalEntity: _id });
    if (!legalEntity) {
      return res.status(404).send({ error: 'Юридическое лицо не существует в базе.' });
    } else if (location.length > 0) {
      return res.status(404).send({ error: 'Юр лицо привязано к локациям ! удаление запрещено' });
    }

    const result = await LegalEntity.deleteOne({ _id });
    return res.send(result);
  } catch (e) {
    return next(e);
  }
});

export default legalEntitiesRouter;

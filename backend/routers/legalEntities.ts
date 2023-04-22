import express from 'express';
import auth from '../middleware/auth';
import permit from '../middleware/permit';
import mongoose from 'mongoose';
import LegalEntity from '../models/LegalEntity';

const legalEntitiesRouter = express.Router();

legalEntitiesRouter.get('/', auth, async (req, res, next) => {
  try {
    const items = await LegalEntity.find();
    return res.send(items);
  } catch (e) {
    return next(e);
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
    const { _id } = req.params;
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
    const { _id } = req.params;
    const legalEntity = await LegalEntity.findById(_id);
    if (!legalEntity) {
      return res.status(404).send({ error: 'Юридическое лицо не существует в базе.' });
    }

    const result = await LegalEntity.deleteOne({ _id });
    return res.send(result);
  } catch (e) {
    return next(e);
  }
});

export default legalEntitiesRouter;

import express from 'express';
import auth from '../middleware/auth';
import Client from '../models/Client';
import mongoose from 'mongoose';
import permit from '../middleware/permit';
import Location from '../models/Location';

const clientsRouter = express.Router();

clientsRouter.post('/', auth, async (req, res, next) => {
  try {
    const clientData = await Client.create({
      companyName: req.body.companyName,
      companyKindOfActivity: req.body.companyKindOfActivity,
      companyAddress: req.body.companyAddress,
      companyPhone: req.body.companyPhone,
      companyEmail: req.body.companyEmail,
      companySite: req.body.companySite,
      companyBirthday: req.body.companyBirthday,
      CompanyManagementName: req.body.CompanyManagementName,
      CompanyManagementJobTitle: req.body.CompanyManagementJobTitle,
      CompanyManagementBirthday: req.body.CompanyManagementBirthday,
      contactPersonName: req.body.contactPersonName,
      contactPersonJobTitle: req.body.contactPersonJobTitle,
      contactPersonBirthday: req.body.contactPersonBirthday,
      advertisingChannel: req.body.advertisingChannel,
    });
    return res.send(clientData);
  } catch (error) {
    if (error instanceof mongoose.Error.ValidationError) {
      return res.status(400).send(error);
    }
    return next(error);
  }
});

clientsRouter.get('/', auth, permit('admin'), async (req, res, next) => {
  try {
    const clients = await Client.find().sort({ _id: -1 });
    return res.send(clients);
  } catch (e) {
    return next(e);
  }
});

clientsRouter.get('/:id', auth, permit('admin'), async (req, res, next) => {
  try {
    const client = await Client.findOne({ _id: req.params.id });
    return res.send(client);
  } catch (e) {
    return next(e);
  }
});

clientsRouter.put('/:id', auth, permit('admin'), async (req, res, next) => {
  const clientEdit = {
    companyName: req.body.companyName,
    companyKindOfActivity: req.body.companyKindOfActivity,
    companyAddress: req.body.companyAddress,
    companyPhone: req.body.companyPhone,
    companyEmail: req.body.companyEmail,
    companySite: req.body.companySite,
    companyBirthday: req.body.companyBirthday,
    CompanyManagementName: req.body.CompanyManagementName,
    CompanyManagementJobTitle: req.body.CompanyManagementJobTitle,
    CompanyManagementBirthday: req.body.CompanyManagementBirthday,
    contactPersonName: req.body.contactPersonName,
    contactPersonJobTitle: req.body.contactPersonJobTitle,
    contactPersonBirthday: req.body.contactPersonBirthday,
    advertisingChannel: req.body.advertisingChannel,
  };
  try {
    const id = req.params.id as string;
    const client = await Client.findById(id);
    if (!client) {
      return res.status(404).send({ error: 'Данный клиент не найден!' });
    }
    await Client.updateMany({ _id: id }, clientEdit);

    return res.send('Edited: ' + id);
  } catch (error) {
    if (error instanceof mongoose.Error.ValidationError) {
      return res.status(400).send(error);
    }
    return next(error);
  }
});

clientsRouter.delete('/:id', auth, permit('admin'), async (req, res, next) => {
  try {
    const client = await Client.findOne({ _id: req.params.id });
    if (!client) {
      return res.send({ error: 'Данный клиент не найден!' });
    }

    const location = await Location.findOne({ client: req.params.id });

    if (location) {
      return res.status(403).send({ error: 'Удаление запрещено!' });
    }

    const deletedClient = await Client.deleteOne({ _id: req.params.id });
    return res.send(deletedClient);
  } catch (e) {
    return next(e);
  }
});

export default clientsRouter;

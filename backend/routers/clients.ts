import express from 'express';
import auth from '../middleware/auth';
import Client from '../models/Client';
import mongoose from 'mongoose';
import permit from '../middleware/permit';
import Location from '../models/Location';
import { AnalClientType, ClientListType, RentHistoryListType } from '../types';
import RentHistory from '../models/RentHistory';
import dayjs from 'dayjs';
import ru from 'dayjs/locale/ru';

const clientsRouter = express.Router();

clientsRouter.get('/anal', auth, async (req, res, next) => {
  let perPage = parseInt(req.query.perPage as string);
  let page = parseInt(req.query.page as string);
  const filter = parseInt(req.query.filter as string) || dayjs().year();
  const constantClient = req.query.constantClient;

  page = isNaN(page) || page <= 0 ? 1 : page;
  perPage = isNaN(perPage) || perPage <= 0 ? 10 : perPage;

  try {
    const count = await Client.count();
    let pages = Math.ceil(count / perPage);

    if (pages === 0) pages = 1;
    if (page > pages) page = pages;

    const clients: ClientListType[] = await Client.find()
      .skip((page - 1) * perPage)
      .limit(perPage);
    const history: RentHistoryListType[] = await RentHistory.find();
    const clintAnal: AnalClientType[] = [];

    clients.forEach((item) => {
      const clientHistory = history.filter((his) => his.client.toString() === item._id.toString());

      if (clientHistory) {
        const obj: AnalClientType = {
          client: item,
          anal: clientHistory.map((item) => {
            const month = dayjs(item.rent_date.end).locale(ru).format('MMMM');
            const capitalizedMonth = month.charAt(0).toLocaleUpperCase() + month.slice(1);
            return {
              date: item.rent_date,
              total: item.rent_cost.toString(),
              month: capitalizedMonth,
              locationId: item.location.toString(),
            };
          }),
          overallBudget: clientHistory
            .filter((item) => dayjs(item.rent_date.end).year() === filter)
            .reduce((accumulator, currentValue) => accumulator + parseInt(currentValue.rent_cost.toString()), 0),
          rentDay: clientHistory
            .filter((item) => dayjs(item.rent_date.end).year() === filter)
            .reduce((accumulator, currentValue) => {
              return accumulator + dayjs(currentValue.rent_date.end).diff(dayjs(currentValue.rent_date.start), 'day');
            }, 0),
          numberOfBanners: clientHistory.filter((item) => dayjs(item.rent_date.end).year() === filter).length,
        };

        clintAnal.push(obj);
      }

      return;
    });

    const clintAnalNew = clintAnal.map((item) => {
      return {
        client: item.client,
        anal: item.anal.filter((el) => {
          const date = dayjs(el.date.start).year();
          if (date === filter) {
            return item;
          } else if (constantClient && constantClient === 'true') {
            if (Math.max(parseInt(el.total)) && Math.max(item.numberOfBanners)) return item;
          }
        }),
        overallBudget: item.overallBudget,
        rentDay: item.rentDay,
        numberOfBanners: item.numberOfBanners,
      };
    });

    return res.send({ clintAnalNew, page, pages, count, perPage });
  } catch (e) {
    return next(e);
  }
});

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

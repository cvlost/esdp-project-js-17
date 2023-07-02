import express from 'express';
import CommercialLink from '../models/CommercialLink';
import Location from '../models/Location';
import { CommercialLinkType } from '../types';
import * as crypto from 'crypto';
import { flattenLookup } from './locations';
import mongoose, { Types } from 'mongoose';
import auth from '../middleware/auth';

const commercialLinksRouter = express.Router();

commercialLinksRouter.get('/listLink', auth, async (req, res, next) => {
  let perPage = parseInt(req.query.perPage as string);
  let page = parseInt(req.query.page as string);
  page = isNaN(page) || page <= 0 ? 1 : page;
  perPage = isNaN(perPage) || perPage <= 0 ? 10 : perPage;

  try {
    const listLinkLength = await CommercialLink.count();
    let pages = Math.ceil(listLinkLength / perPage);
    if (pages === 0) pages = 1;
    if (page > pages) page = pages;
    const listLink = await CommercialLink.find()
      .skip((page - 1) * perPage)
      .limit(perPage)
      .sort({ _id: -1 });
    return res.send({ listLink, page, pages, listLinkLength, perPage });
  } catch (e) {
    return next(e);
  }
});

commercialLinksRouter.get('/:shortUrl', async (req, res, next) => {
  try {
    const commLink = await CommercialLink.findOne({ shortUrl: req.params.shortUrl });
    if (!commLink) {
      return res.status(404).send({ message: 'Ссылка недействительна !' });
    }
    return res.status(302).redirect(`http://95.85.35.4/link/${commLink._id}`);
  } catch (e) {
    return next(e);
  }
});

commercialLinksRouter.post('/', auth, async (req, res, next) => {
  const randomShortUrl = crypto.randomUUID();
  try {
    const newCommLink = await CommercialLink.create({
      location: req.body.location,
      settings: req.body.settings,
      description: req.body.description,
      title: req.body.title,
      shortUrl: randomShortUrl,
      fullLink: `http://95.85.35.4:8000/link/${randomShortUrl}`,
    });
    return res.send(newCommLink);
  } catch (e) {
    if (e instanceof mongoose.Error.ValidationError) {
      return res.status(400).send(e);
    }
    return next(e);
  }
});

commercialLinksRouter.get('/location/:id', async (req, res, next) => {
  try {
    const commLink: CommercialLinkType | null = await CommercialLink.findOne({ _id: req.params.id });
    if (!commLink) return res.status(404).send({ error: 'Ссылка недействительна !' });
    const locations = await Location.find({ _id: commLink.location });

    const selects: { [key: string]: number } = {};

    commLink.settings.forEach((item) => {
      if (!item.show) {
        selects[item.name] = 0;
      }
    });

    if (Object.keys(selects).length !== 0) {
      const fullLocations = await Location.aggregate([
        ...flattenLookup,
        { $match: { _id: { $in: locations.map((loc) => loc._id) } } },
        { $project: selects },
      ]);

      return res.send({
        location: fullLocations,
        description: commLink.description,
        title: commLink.title,
      });
    }

    const fullLocations = await Location.aggregate([
      ...flattenLookup,
      { $match: { _id: { $in: locations.map((loc) => loc._id) } } },
    ]);

    return res.send({
      location: fullLocations,
      description: commLink.description,
      title: commLink.title,
    });
  } catch (e) {
    return next(e);
  }
});

commercialLinksRouter.get('/location/:idLink/locationOne/:idLoc', async (req, res, next) => {
  const idLink = req.params.idLink;
  const idLoc = req.params.idLoc;
  try {
    const commLink: CommercialLinkType | null = await CommercialLink.findOne({ _id: idLink });
    if (!commLink) return res.status(500).send({ error: 'Ссылка недействительна !' });

    const selects: { [key: string]: number } = {};

    commLink.settings.forEach((item) => {
      if (!item.show) {
        selects[item.name] = 0;
      }
    });

    if (Object.keys(selects).length !== 0) {
      const [locationOne] = await Location.aggregate([
        ...flattenLookup,
        { $match: { _id: new Types.ObjectId(idLoc) } },
        { $project: selects },
      ]);

      return res.send({
        location: locationOne,
        description: commLink.description,
        title: commLink.title,
      });
    }

    const [locationOne] = await Location.aggregate([...flattenLookup, { $match: { _id: new Types.ObjectId(idLoc) } }]);

    return res.send({
      location: locationOne,
      description: commLink.description,
      title: commLink.title,
    });
  } catch (e) {
    return next(e);
  }
});

commercialLinksRouter.delete('/:id', auth, async (req, res, next) => {
  const _id = req.params.id as string;

  if (!mongoose.isValidObjectId(_id)) {
    return res.status(422).send({ error: 'Некорректный id ссылки.' });
  }

  try {
    await CommercialLink.deleteOne({ _id: req.params.id });
    return res.send({ remove: req.params.id });
  } catch (e) {
    return next(e);
  }
});

export default commercialLinksRouter;

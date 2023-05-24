import express from 'express';
import CommercialLink from '../models/CommercialLink';
import Location from '../models/Location';
import { CommercialLinkType } from '../types';
import * as crypto from 'crypto';
import { flattenLookup } from './locations';
import { Types } from 'mongoose';
import auth from '../middleware/auth';

const commercialLinksRouter = express.Router();

commercialLinksRouter.get('/:shortUrl', async (req, res) => {
  try {
    const commLink = await CommercialLink.findOne({ shortUrl: req.params.shortUrl });

    if (!commLink) {
      return res.status(404).send({ message: 'Ссылка недествительна !' });
    }
    return res.status(301).redirect(`http://localhost:3000/link/${commLink._id}`);
  } catch (e) {
    return res.sendStatus(500);
  }
});

commercialLinksRouter.post('/', auth, async (req, res) => {
  const randomShortUrl = crypto.randomUUID();
  try {
    const newCommLink = await CommercialLink.create({
      location: req.body.location,
      settings: req.body.settings,
      description: req.body.description,
      title: req.body.title,
      shortUrl: randomShortUrl,
      fullLink: `http://localhost:8000/link/${randomShortUrl}`,
    });

    return res.send(newCommLink);
  } catch (e) {
    return res.sendStatus(500);
  }
});

commercialLinksRouter.get('/location/:id', async (req, res) => {
  const commLink: CommercialLinkType | null = await CommercialLink.findOne({ _id: req.params.id });

  if (!commLink) return res.status(500).send({ error: 'Ссылка недействительна !' });

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
});

commercialLinksRouter.get('/location/:idLink/locationOne/:idLoc', async (req, res) => {
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
    return res.sendStatus(500);
  }
});

export default commercialLinksRouter;

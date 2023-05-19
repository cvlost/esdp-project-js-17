import express from 'express';
import CommercialLink from '../models/CommercialLink';
import Location from '../models/Location';
import { CommercialLinkType } from '../types';
import * as crypto from 'crypto';

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

commercialLinksRouter.post('/', async (req, res) => {
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
  const selects: { [key: string]: number } = {};

  commLink.settings.forEach((item) => {
    if (item.show) {
      selects[item.name] = 1;
    }
  });

  const locations = await Location.find({ _id: commLink.location });
  const fullLocations = await Location.aggregate([
    { $lookup: { from: 'cities', localField: 'city', foreignField: '_id', as: 'city' } },
    { $lookup: { from: 'regions', localField: 'region', foreignField: '_id', as: 'region' } },
    { $lookup: { from: 'streets', localField: 'street', foreignField: '_id', as: 'street' } },
    { $lookup: { from: 'areas', localField: 'area', foreignField: '_id', as: 'area' } },
    { $lookup: { from: 'formats', localField: 'format', foreignField: '_id', as: 'format' } },
    { $lookup: { from: 'directions', localField: 'direction', foreignField: '_id', as: 'direction' } },
    { $lookup: { from: 'legalentities', localField: 'legalEntity', foreignField: '_id', as: 'legalEntity' } },
    { $set: { city: { $first: '$city.name' } } },
    { $set: { region: { $first: '$region.name' } } },
    { $set: { street: { $first: '$street.name' } } },
    { $set: { direction: { $first: '$direction.name' } } },
    { $set: { area: { $first: '$area.name' } } },
    { $set: { format: { $first: '$format.name' } } },
    { $set: { legalEntity: { $first: '$legalEntity.name' } } },
    { $set: { price: { $convert: { input: '$price', to: 'string' } } } },
    { $match: { _id: { $in: locations.map((loc) => loc._id) } } },
    { $project: selects },
  ]);

  return res.send(fullLocations);
});

export default commercialLinksRouter;

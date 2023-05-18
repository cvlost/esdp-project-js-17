import express from 'express';
import auth from '../middleware/auth';
import CommercialLink from '../models/CommercialLink';

const commercialLinksRouter = express.Router();

commercialLinksRouter.get('/:shortUrl', auth, async (req, res) => {
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
      shortUrl: req.body.shortUrl,
      fullLink: `http://localhost:8000/links/${randomShortUrl}`,
    });

    return res.send(newCommLink);
  } catch (e) {
    return res.sendStatus(500);
  }
});

export default commercialLinksRouter;

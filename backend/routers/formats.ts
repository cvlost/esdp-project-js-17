import express from 'express';
import auth from '../middleware/auth';
import { FormatType } from '../types';
import permit from '../middleware/permit';
import Format from '../models/Format';

const formatRouter = express.Router();

formatRouter.get('/', auth, permit('admin'), async (req, res, next) => {
  try {
    const formats: FormatType[] = await Format.find();
    return res.send(formats);
  } catch (e) {
    return next(e);
  }
});

export default formatRouter;

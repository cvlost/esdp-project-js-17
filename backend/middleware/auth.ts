import { NextFunction, Request, Response } from 'express';
import { HydratedDocument } from 'mongoose';
import { IUser } from '../types';
import User from '../models/Users';

export interface RequestWithUser extends Request {
  user: HydratedDocument<IUser>;
}

const auth = async (expressReq: Request, res: Response, next: NextFunction) => {
  const req = expressReq as RequestWithUser;
  const token = req.get('Authorization');

  if (!token) {
    return res.status(401).send({ error: 'Отсутствует токен авторизации.' });
  }
  const user = await User.findOne({ token });

  if (!user) {
    return res.status(401).send({ error: 'Предоставлен неверный токен авторизации.' });
  }

  req.user = user;

  return next();
};

export default auth;

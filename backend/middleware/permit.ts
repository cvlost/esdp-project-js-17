import { Request, Response, NextFunction } from 'express';
import { RequestWithUser } from './auth';

const permit = (...roles: string[]) => {
  return (expressReq: Request, res: Response, next: NextFunction) => {
    const req = expressReq as RequestWithUser;

    if (!req.user) {
      return res.status(401).send({ error: 'Неаутетифицированный пользовать' });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).send({ error: 'Неавторизованный пользователь. Нет прав на совершение действия' });
    }

    return next();
  };
};

export default permit;

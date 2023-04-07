import express from 'express';

const usersRouter = express.Router();

usersRouter.post('/', async (req, res, next) => {
  try {
    return res.send({ message: 'works' });
  } catch (e) {
    return next(e);
  }
});

export default usersRouter;

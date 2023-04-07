import express from 'express';

const usersRouter = express.Router();

usersRouter.post('/', async (req, res, next) => {
  try {
    return;
  } catch (e) {
    console.log(e);
  }
});

export default usersRouter;

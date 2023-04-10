import express from 'express';
import User from '../models/Users';
import auth from '../middleware/auth';
import permit from '../middleware/permit';

const usersRouter = express.Router();

usersRouter.post('/', async (req, res, next) => {
  try {
    return res.send({ message: 'works' });
  } catch (e) {
    return next(e);
  }
});

usersRouter.post('/sessions', async (req, res, next) => {
  const user = await User.findOne({ email: req.body.email });

  if (!user) {
    return res.status(400).send({ error: 'Email or password is incorrect!' });
  }

  const isMatch = await user.checkPassword(req.body.password);

  if (!isMatch) {
    return res.status(400).send({ error: 'Email or password is incorrect!' });
  }

  try {
    user.generateToken();
    await user.save();

    return res.send({ message: 'Username and password correct!', user });
  } catch (e) {
    return next(e);
  }
});

usersRouter.delete('/sessions', async (req, res, next) => {
  try {
    const token = req.get('Authorization');
    const success = { message: 'ok' };

    if (!token) {
      return res.send(success);
    }

    const user = await User.findOne({ token });

    if (!user) {
      return res.send(success);
    }

    user.generateToken();
    await user.save();
    return res.send(success);
  } catch (e) {
    return next(e);
  }
});

usersRouter.get('/', auth, permit('admin'), async (req, res, next) => {
  const page = parseInt(req.query.page as string);
  const perPage = 5;

  try {
    if (!page) {
      const allUsers = await User.find();
      return res.send({ length: allUsers.length, allUsers });
    }
    const users = await User.find()
      .skip((page - 1) * perPage)
      .limit(perPage);

    return res.send({ length: users.length, users });
  } catch (e) {
    return next(e);
  }
});

export default usersRouter;

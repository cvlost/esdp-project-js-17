import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import config from './config';
import usersRouter from './routers/users';
import citiesRouter from './routers/cities';
import regionsRouter from './routers/regions';
import directionRouter from './routers/directions';
import locationsRouter from './routers/locations';
import formatRouter from './routers/formats';
import areasRouter from './routers/areas';
import streetsRouter from './routers/streets';
import legalEntitiesRouter from './routers/legalEntities';
import commercialLinksRouter from './routers/commercialLinks';
import sizesRouter from './routers/sizes';
import lightingRouter from './routers/lightings';
import clientsRouter from './routers/clients';

const app = express();
const port = 8000;
app.use(cors());
app.use(express.static('public'));
app.use(express.json());

app.use('/users', usersRouter);
app.use('/cities', citiesRouter);
app.use('/regions', regionsRouter);
app.use('/streets', streetsRouter);
app.use('/direction', directionRouter);
app.use('/formats', formatRouter);
app.use('/areas', areasRouter);
app.use('/legalEntities', legalEntitiesRouter);
app.use('/locations', locationsRouter);
app.use('/link', commercialLinksRouter);
app.use('/sizes', sizesRouter);
app.use('/lighting', lightingRouter);
app.use('/clients', clientsRouter);

const run = async () => {
  mongoose.set('strictQuery', false);
  await mongoose.connect(config.db);

  app.listen(port, () => {
    console.log('We are live on ' + port);
  });
  process.on('exit', () => {
    void mongoose.disconnect();
  });
};

run().catch(console.error);

import express from 'express';
import cors from 'cors';
import { createServer } from 'http';
import * as notificationsService from '../services/notifications-service';

const app = express();
const server = createServer(app);
notificationsService.setupWebSocket(server);

app.use(cors());
app.use(express.static('public'));
app.use(express.json());

export default app;

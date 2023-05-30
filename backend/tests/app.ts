import express from 'express';
import cors from 'cors';

const app = express();

app.use(cors());
app.use(express.static('public'));
app.use(express.json());

export default app;

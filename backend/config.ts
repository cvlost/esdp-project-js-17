import path from 'path';
import * as dotenv from 'dotenv';

const envFile = process.env.NODE_ENV ? `.env.${process.env.NODE_ENV}` : '.env';
dotenv.config({ path: envFile });

const rootPath = __dirname;

const config = {
  rootPath,
  publicPath: path.join(rootPath, 'public'),
  db: process.env.DB_URL || 'mongodb://localhost/ESDP-17',
  imgDirName: process.env.IMG_DIR_NAME || 'images',
  port: Number(process.env.PORT) || 8000,
  apiUrl: process.env.API_URL || 'http://localhost:8000',
  clientUrl: process.env.CLIENT_URL || 'http://localhost:3000',
};

export default config;

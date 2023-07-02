import multer from 'multer';
import { promises as fs } from 'fs';
import path from 'path';
import { randomUUID } from 'crypto';
import config from './config';

const imageStorage = multer.diskStorage({
  destination: async (_req, _file, cb) => {
    const destDir = path.join(config.publicPath, config.imgDirName);
    const destDirDay = path.join(destDir, 'day');
    const destDirSchema = path.join(destDir, 'schema');

    await fs.mkdir(destDir, { recursive: true });
    await fs.mkdir(destDirDay, { recursive: true });
    await fs.mkdir(destDirSchema, { recursive: true });

    if (_file.fieldname === 'dayImage') {
      cb(null, destDirDay);
    } else if (_file.fieldname === 'schemaImage') {
      cb(null, destDirSchema);
    }
  },
  filename: (_req, file, cb) => {
    const extension = path.extname(file.originalname);
    cb(null, randomUUID() + extension);
  },
});

export const imagesUpload = multer({ storage: imageStorage });

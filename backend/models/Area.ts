import { model, Schema } from 'mongoose';
import { AreaType } from '../types';

const AreaSchema = new Schema<AreaType>(
  {
    name: {
      type: String,
      required: true,
      unique: true,
    },
  },
  { versionKey: false },
);

const Area = model('Area', AreaSchema);
export default Area;

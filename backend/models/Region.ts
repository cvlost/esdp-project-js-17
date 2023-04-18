import { model, Schema } from 'mongoose';
import { RegionType } from '../types';

const RegionSchema = new Schema<RegionType>({
  name: {
    type: String,
    required: true,
  },
});

const Region = model('Region', RegionSchema);
export default Region;

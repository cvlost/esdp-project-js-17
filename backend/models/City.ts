import { model, Schema } from 'mongoose';
import { CityType } from '../types';

const CitySchema = new Schema<CityType>({
  name: {
    type: String,
    required: true,
  },
});

const City = model('City', CitySchema);
export default City;

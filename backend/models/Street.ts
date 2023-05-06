import { model, Schema, Types } from 'mongoose';
import { StreetType } from '../types';
import City from './City';

const StreetSchema = new Schema<StreetType>({
  city: {
    type: Schema.Types.ObjectId,
    ref: 'City',
    required: true,
    validate: {
      validator: async (value: Types.ObjectId) => City.findById(value),
      message: 'Данный город не существует!',
    },
  },
  region: {
    type: Schema.Types.ObjectId,
    ref: 'Region',
    required: false,
  },
  name: {
    type: String,
    required: true,
  },
});

const Street = model('Street', StreetSchema);

export default Street;

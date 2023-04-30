import { model, Schema, Types } from 'mongoose';
import { CityType } from '../types';
import Area from './Area';

const CitySchema = new Schema<CityType>({
  area: {
    type: Schema.Types.ObjectId,
    ref: 'area',
    required: true,
    validate: {
      validator: async (value: Types.ObjectId) => {
        const area = await Area.findById(value);
        return area !== null;
      },
      message: 'Данная область не существует!',
    },
  },
  name: {
    type: String,
    required: true,
    unique: true,
  },
});

const City = model('City', CitySchema);
export default City;

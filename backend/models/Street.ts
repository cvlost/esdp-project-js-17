import { model, Schema } from 'mongoose';
import { StreetType } from '../types';

const StreetSchema = new Schema<StreetType>({
  name: {
    type: String,
    required: true,
  },
});

const Street = model('Street', StreetSchema);

export default Street;

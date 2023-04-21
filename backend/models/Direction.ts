import { model, Schema } from 'mongoose';
import { DirectionType } from '../types';

const DirectionSchema = new Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },
});

const Direction = model<DirectionType>('Direction', DirectionSchema);
export default Direction;

import { model, Schema } from 'mongoose';
import { SizeType } from '../types';

const SizeSchema = new Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },
});

const Size = model<SizeType>('Size', SizeSchema);
export default Size;

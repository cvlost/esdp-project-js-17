import { model, Schema } from 'mongoose';
import { FormatType } from '../types';

const FormatSchema = new Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },
});

const Format = model<FormatType>('Format', FormatSchema);
export default Format;

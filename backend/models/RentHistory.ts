import { model, Schema, Types } from 'mongoose';
import { RentHistoryType } from '../types';
import { PeriodSchema } from './Period';

const RentHistorySchema = new Schema<RentHistoryType>({
  client: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: 'Client',
  },
  location: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: 'Location',
  },
  rent_price: {
    type: Schema.Types.Decimal128,
    required: true,
    validate: {
      validator: (value: Types.Decimal128) => value >= Types.Decimal128.fromString('0'),
      message: 'Цена не может быть меньше нуля',
    },
  },
  rent_cost: {
    type: Schema.Types.Decimal128,
    required: true,
    validate: {
      validator: (value: Types.Decimal128) => value >= Types.Decimal128.fromString('0'),
      message: 'Цена не может быть меньше нуля',
    },
  },
  rent_date: PeriodSchema,
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const RentHistory = model('RentHistory', RentHistorySchema);
export default RentHistory;

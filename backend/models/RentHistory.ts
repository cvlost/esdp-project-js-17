import { model, Schema } from 'mongoose';
import { RentHistoryType } from '../types';
import { PeriodSchema } from './Period';

const RentHistorySchema = new Schema<RentHistoryType>({
  client_id: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: 'Client',
  },
  location_id: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: 'Location',
  },
  price: {
    type: String,
    required: true,
  },
  rent_date: PeriodSchema,
});

const RentHistory = model('RentHistory', RentHistorySchema);
export default RentHistory;

import { model, Schema } from 'mongoose';
import { BookingHistoryType } from '../types';
import { PeriodSchema } from './Period';

const BookingHistorySchema = new Schema<BookingHistoryType>({
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
  booking_date: PeriodSchema,
});

const BookingHistory = model('BookingHistory', BookingHistorySchema);
export default BookingHistory;

import { model, Schema, Types } from 'mongoose';
import { BookingType } from '../types';
import Client from './Client';

const BookingSchema = new Schema<BookingType>({
  clientId: {
    type: Schema.Types.ObjectId,
    ref: 'Client',
    required: true,
    validate: {
      validator: async (value: Types.ObjectId) => Client.findById(value),
      message: 'Данный клиент не существует!',
    },
  },
  locationId: {
    type: Schema.Types.ObjectId,
    ref: 'Location',
    required: true,
    validate: {
      validator: async (value: Types.ObjectId) => Client.findById(value),
      message: 'Данная локация не существует!',
    },
  },
  booking_date: [Schema.Types.Date],
});

const Booking = model('Booking', BookingSchema);
export default Booking;

import { HydratedDocument, model, Schema, Types } from 'mongoose';
import { BookingType, IPeriod } from '../types';
import Client from './Client';
import Location from './Location';

const PeriodSchema = new Schema<IPeriod>(
  {
    start: {
      type: Date,
      required: true,
      validate: {
        validator: function (this: HydratedDocument<IPeriod>, value: Date) {
          return value < this.end;
        },
        message: 'Дата начала аренды должа быть меньше даты окончания.',
      },
    },
    end: {
      type: Date,
      required: true,
      validate: {
        validator: function (this: HydratedDocument<IPeriod>, value: Date) {
          return value > this.start;
        },
        message: 'Дата окончания аренды должа быть больше даты начала.',
      },
    },
  },
  { versionKey: false, _id: false },
);

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
      validator: async (value: Types.ObjectId) => Location.findById(value),
      message: 'Данная локация не существует!',
    },
  },
  booking_date: PeriodSchema,
});

const Booking = model('Booking', BookingSchema);
export default Booking;

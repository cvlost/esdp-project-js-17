import { HydratedDocument, model, Schema, Types } from 'mongoose';
import { ILocation, IPeriod } from '../types';
import City from './City';
import Region from './Region';
import Direction from './Direction';
import { BILLBOARD_LIGHTINGS, BILLBOARD_SIZES } from '../constants';
import Area from './Area';
import Street from './Street';
import LegalEntity from './LegalEntity';
import Format from './Format';
import Booking from './Booking';

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

const LocationSchema = new Schema<ILocation>({
  client: {
    type: Schema.Types.ObjectId,
    required: true,
  },
  booking: {
    type: Schema.Types.ObjectId,
    ref: 'Booking',
    required: true,
    validate: {
      validator: async (value: Types.ObjectId) => Booking.findById(value),
      message: 'Данная бронь не существует!',
    },
  },
  nearest_booking_date: [Schema.Types.Date],
  price: {
    type: Schema.Types.Decimal128,
    required: true,
    validate: {
      validator: (value: Types.Decimal128) => value >= Types.Decimal128.fromString('0'),
      message: 'Цена не может быть меньше нуля',
    },
  },
  rent: PeriodSchema,
  reserve: PeriodSchema,
  description: String,
  addressNote: String,
  image: String,
  placement: {
    type: Boolean,
    required: true,
  },
  country: {
    type: String,
    required: true,
    default: 'Кыргызстан',
  },
  size: {
    type: String,
    required: true,
    enum: BILLBOARD_SIZES,
  },
  lighting: {
    type: String,
    required: true,
    enum: BILLBOARD_LIGHTINGS,
  },
  format: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: 'Format',
    validate: {
      validator: (id: Types.ObjectId) => Format.findById(id),
      message: 'Неверный id формата.',
    },
  },
  legalEntity: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: 'LegalEntity',
    validate: {
      validator: (id: Types.ObjectId) => LegalEntity.findById(id),
      message: 'Неверный id юридического лица.',
    },
  },
  area: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: 'Area',
    validate: {
      validator: (id: Types.ObjectId) => Area.findById(id),
      message: 'Неверный id области.',
    },
  },
  street: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: 'Street',
    validate: {
      validator: (id: Types.ObjectId) => Street.findById(id),
      message: 'Неверный id улицы.',
    },
  },
  city: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: 'City',
    validate: {
      validator: (id: Types.ObjectId) => City.findById(id),
      message: 'Неверный id города.',
    },
  },
  region: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: 'Region',
    validate: {
      validator: (id: Types.ObjectId) => Region.findById(id),
      message: 'Неверный id района.',
    },
  },
  direction: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: 'Direction',
    validate: {
      validator: (id: Types.ObjectId) => Direction.findById(id),
      message: 'Неверный id направления.',
    },
  },
});

const Location = model<ILocation>('Location', LocationSchema);

export default Location;

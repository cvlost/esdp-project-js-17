import { model, Schema, Types } from 'mongoose';
import { ILocation } from '../types';
import City from './City';
import Direction from './Direction';
import Area from './Area';
import Street from './Street';
import LegalEntity from './LegalEntity';
import Format from './Format';
import Size from './Size';
import Lighting from './Lighting';
import { PeriodSchema } from './Period';
import dayjs from 'dayjs';

const LocationSchema = new Schema<ILocation>({
  client: {
    type: Schema.Types.ObjectId,
    ref: 'Client',
    default: null,
  },
  booking: {
    type: [Schema.Types.ObjectId],
    ref: 'Booking',
    default: [],
  },
  price: {
    type: Schema.Types.Decimal128,
    required: true,
    validate: {
      validator: (value: Types.Decimal128) => value >= Types.Decimal128.fromString('0'),
      message: 'Цена не может быть меньше нуля',
    },
  },
  rent: {
    type: PeriodSchema,
    default: null,
  },
  description: String,
  addressNote: String,
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
    type: Schema.Types.ObjectId,
    ref: 'Size',
    required: true,
    validate: {
      validator: (id: Types.ObjectId) => Size.findById(id),
      message: 'Неверный id размера.',
    },
  },
  lighting: {
    type: Schema.Types.ObjectId,
    ref: 'Lighting',
    required: true,
    validate: {
      validator: (id: Types.ObjectId) => Lighting.findById(id),
      message: 'Неверный id освещения.',
    },
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
  streets: [
    {
      type: Schema.Types.ObjectId,
      required: true,
      ref: 'Street',
      validate: {
        validator: (id: Types.ObjectId) => Street.findById(id),
        message: 'Неверный id улицы.',
      },
    },
    {
      type: Schema.Types.ObjectId,
      required: true,
      ref: 'Street',
      validate: {
        validator: (id: Types.ObjectId) => Street.findById(id),
        message: 'Неверный id улицы.',
      },
    },
  ],
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
    ref: 'Region',
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
  dayImage: {
    type: String,
    required: true,
  },
  schemaImage: {
    type: String,
    required: true,
  },
  checked: {
    type: Boolean,
    default: false,
  },
  status: {
    type: String,
    enum: ['Занят', 'Свободный', null],
    default: null,
  },
  month: {
    type: String,
    default: dayjs().format('MMMM'),
  },
  year: {
    type: Number,
    default: dayjs().year(),
  },
});

LocationSchema.set('toJSON', {
  transform: (doc, ret) => {
    ret.price = ret.price.toString();
    return ret;
  },
});

LocationSchema.pre('save', function (next) {
  const currentDate = dayjs();
  if (this.rent && dayjs(this.rent.end) < currentDate) {
    this.rent = null;
    this.client = null;
  }
  next();
});

const Location = model<ILocation>('Location', LocationSchema);

export default Location;

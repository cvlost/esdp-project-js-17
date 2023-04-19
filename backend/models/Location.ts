import { model, Schema, Types } from 'mongoose';
import { ILocation } from '../types';
import City from './City';
import Region from './Region';
import Direction from './Direction';

const LocationSchema = new Schema<ILocation>({
  description: String,
  addressNote: String,
  address: {
    type: String,
    required: true,
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

const Location = model('Location', LocationSchema);

export default Location;

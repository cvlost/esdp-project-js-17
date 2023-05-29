import { HydratedDocument, model, Schema, Types } from 'mongoose';
import { RegionType } from '../types';
import City from './City';

const RegionSchema = new Schema<RegionType>({
  name: {
    type: String,
    required: true,
    unique: true,
    validate: {
      validator: async function (this: HydratedDocument<RegionType>, name: string): Promise<boolean> {
        if (!this.isModified('name')) return true;
        const region: HydratedDocument<RegionType> | null = await Region.findOne({ name });
        return !region;
      },
      message: 'Такой район уже существуеют!',
    },
  },
  city: {
    type: Schema.Types.ObjectId,
    ref: 'City',
    required: true,
    validate: {
      validator: (value: Types.ObjectId) => City.findById(value),
      message: 'Данного города нет',
    },
  },
});

const Region = model('Region', RegionSchema);
export default Region;

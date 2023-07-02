import { HydratedDocument, model, Schema, Types } from 'mongoose';
import { CityType } from '../types';
import Area from './Area';

const CitySchema = new Schema<CityType>(
  {
    area: {
      type: Schema.Types.ObjectId,
      ref: 'area',
      required: true,
      validate: {
        validator: async (value: Types.ObjectId) => {
          const area = await Area.findById(value);
          return area !== null;
        },
        message: 'Данная область не существует!',
      },
    },
    name: {
      type: String,
      required: true,
      unique: true,
      validate: {
        validator: async function (this: HydratedDocument<CityType>, name: string): Promise<boolean> {
          if (!this.isModified('name')) return true;
          const city: HydratedDocument<CityType> | null = await City.findOne({ name });
          return !city;
        },
        message: 'Такой город уже существуеют!',
      },
    },
  },
  { versionKey: false },
);

const City = model('City', CitySchema);
export default City;

import { HydratedDocument, model, Schema, Types } from 'mongoose';
import { StreetType } from '../types';
import City from './City';

const StreetSchema = new Schema<StreetType>(
  {
    city: {
      type: Schema.Types.ObjectId,
      ref: 'City',
      required: true,
      validate: {
        validator: async (value: Types.ObjectId) => City.findById(value),
        message: 'Данный город не существует!',
      },
    },
    name: {
      type: String,
      required: true,
      validate: {
        validator: async function (this: HydratedDocument<StreetType>, name: string): Promise<boolean> {
          if (!this.isModified('name')) return true;
          const street: HydratedDocument<StreetType> | null = await Street.findOne({ name, city: this.city });
          return !street;
        },
        message: 'Такая улица в городе уже существуеют!',
      },
    },
  },
  { versionKey: false },
);

const Street = model('Street', StreetSchema);

export default Street;

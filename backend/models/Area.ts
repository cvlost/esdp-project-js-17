import { HydratedDocument, model, Schema } from 'mongoose';
import { AreaType } from '../types';

const AreaSchema = new Schema<AreaType>(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      validate: {
        validator: async function (this: HydratedDocument<AreaType>, name: string): Promise<boolean> {
          if (!this.isModified('name')) return true;
          const area: HydratedDocument<AreaType> | null = await Area.findOne({ name });
          return !area;
        },
        message: 'Такая область уже существует!',
      },
    },
  },
  { versionKey: false },
);

const Area = model('Area', AreaSchema);
export default Area;

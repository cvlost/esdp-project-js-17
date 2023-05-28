import { HydratedDocument, model, Schema } from 'mongoose';
import { LightingType } from '../types';

const LightingSchema = new Schema<LightingType>(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      validate: {
        validator: async function (this: HydratedDocument<LightingType>, name: string): Promise<boolean> {
          if (!this.isModified('name')) return true;
          const lighting: HydratedDocument<LightingType> | null = await Lighting.findOne({ name });
          return !lighting;
        },
        message: 'Такое освещение уже существуеют!',
      },
    },
  },
  { versionKey: false },
);

const Lighting = model<LightingType>('Lighting', LightingSchema);
export default Lighting;

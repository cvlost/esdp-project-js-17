import { HydratedDocument, model, Schema } from 'mongoose';
import { SizeType } from '../types';

const SizeSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      validate: {
        validator: async function (this: HydratedDocument<SizeType>, name: string): Promise<boolean> {
          if (!this.isModified('name')) return true;
          const size: HydratedDocument<SizeType> | null = await Size.findOne({ name });
          return !size;
        },
        message: 'Такой размер уже существуеют!',
      },
    },
  },
  { versionKey: false },
);

const Size = model<SizeType>('Size', SizeSchema);
export default Size;

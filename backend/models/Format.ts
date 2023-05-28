import { HydratedDocument, model, Schema } from 'mongoose';
import { FormatType } from '../types';

const FormatSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      validate: {
        validator: async function (this: HydratedDocument<FormatType>, name: string): Promise<boolean> {
          if (!this.isModified('name')) return true;
          const format: HydratedDocument<FormatType> | null = await Format.findOne({ name });
          return !format;
        },
        message: 'Такой формат лицо уже существуеют!',
      },
    },
  },
  { versionKey: false },
);

const Format = model<FormatType>('Format', FormatSchema);
export default Format;

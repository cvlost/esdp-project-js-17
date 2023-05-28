import { HydratedDocument, model, Schema } from 'mongoose';
import { DirectionType } from '../types';

const DirectionSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      validate: {
        validator: async function (this: HydratedDocument<DirectionType>, name: string): Promise<boolean> {
          if (!this.isModified('name')) return true;
          const direction: HydratedDocument<DirectionType> | null = await Direction.findOne({ name });
          return !direction;
        },
        message: 'Такое направление уже существуеют!',
      },
    },
  },
  { versionKey: false },
);

const Direction = model<DirectionType>('Direction', DirectionSchema);
export default Direction;

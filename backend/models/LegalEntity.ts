import { HydratedDocument, model, Schema } from 'mongoose';
import { LegalEntityType } from '../types';

const LegalEntitySchema = new Schema<LegalEntityType>(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      validate: {
        validator: async function (this: HydratedDocument<LegalEntityType>, name: string): Promise<boolean> {
          if (!this.isModified('name')) return true;
          const entity: HydratedDocument<LegalEntityType> | null = await LegalEntity.findOne({ name });
          return !entity;
        },
        message: 'Такое юридическое лицо уже существуеют!',
      },
    },
  },
  { versionKey: false },
);

const LegalEntity = model<LegalEntityType>('LegalEntity', LegalEntitySchema);
export default LegalEntity;

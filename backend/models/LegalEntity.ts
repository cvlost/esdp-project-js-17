import { model, Schema } from 'mongoose';
import { LegalEntityType } from '../types';

const LegalEntitySchema = new Schema<LegalEntityType>({
  name: {
    type: String,
    required: true,
  },
});

const LegalEntity = model<LegalEntityType>('LegalEntity', LegalEntitySchema);
export default LegalEntity;

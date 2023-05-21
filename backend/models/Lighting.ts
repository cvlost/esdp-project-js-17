import { model, Schema } from 'mongoose';

const LightingSchema = new Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },
});

const Lighting = model('Lighting', LightingSchema);
export default Lighting;

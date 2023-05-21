import { model, Schema } from 'mongoose';
import { CommercialLinkType } from '../types';

const CommercialLinkSchema = new Schema<CommercialLinkType>({
  location: {
    type: [String],
    required: true,
  },
  settings: {
    type: [{ id: String, name: String, show: Boolean }],
    required: true,
  },
  description: String,
  title: String,
  shortUrl: String,
  fullLink: String,
});

const CommercialLink = model('CommercialLink', CommercialLinkSchema);
export default CommercialLink;

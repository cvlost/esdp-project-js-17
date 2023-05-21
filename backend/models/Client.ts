import { model, Schema } from 'mongoose';
import { ClientType } from '../types';

const ClientSchema = new Schema<ClientType>({
  name: {
    type: 'String',
    required: true,
  },
  phone: {
    type: 'String',
    required: true,
  },
  email: {
    type: 'String',
  },
});

const Client = model('Client', ClientSchema);
export default Client;

import { model, Schema } from 'mongoose';
import { ClientType } from '../types';

const ClientSchema = new Schema<ClientType>({
  companyName: {
    type: String,
    required: true,
  },
  companyKindOfActivity: {
    type: String,
  },
  companyAddress: {
    type: String,
  },
  companyPhone: {
    type: String,
  },
  companyEmail: {
    type: String,
  },
  companySite: {
    type: String,
  },
  companyBirthday: {
    type: String,
  },
  CompanyManagementName: {
    type: String,
  },
  CompanyManagementJobTitle: {
    type: String,
  },
  CompanyManagementBirthday: {
    type: String,
  },
  contactPersonName: {
    type: String,
  },
  contactPersonJobTitle: {
    type: String,
  },
  contactPersonBirthday: {
    type: String,
  },
  advertisingChannel: {
    type: String,
  },
});

const Client = model('Client', ClientSchema);
export default Client;

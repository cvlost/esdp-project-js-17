import { Schema, Types } from 'mongoose';

export interface IUser {
  email: string;
  password: string;
  token: string;
  role: string;
  displayName: string;
}

export interface CityType {
  area: Schema.Types.ObjectId | string;
  name: string;
}

export interface RegionType {
  name: string;
  city: Schema.Types.ObjectId | string;
}

export interface DirectionType {
  name: string;
}

export interface StreetType {
  city: Schema.Types.ObjectId | string;
  name: string;
}

export interface LegalEntityType {
  name: string;
}

export interface IPeriod {
  start: Date;
  end: Date;
}

export interface ILocation {
  client?: Schema.Types.ObjectId | null;
  booking?: Schema.Types.ObjectId[];
  country: string;
  area: Types.ObjectId;
  region: Types.ObjectId;
  city: Types.ObjectId;
  streets: [Types.ObjectId, Types.ObjectId];
  direction: Types.ObjectId;
  legalEntity: Types.ObjectId;
  format: Types.ObjectId;
  price: Types.Decimal128;
  rent?: IPeriod | null;
  lighting: Types.ObjectId;
  placement: boolean;
  size: Types.ObjectId;
  addressNote?: string;
  description?: string;
  dayImage: string | null;
  schemaImage: string | null;
  checked?: boolean;
  status?: string | null;
}

export interface AreaType {
  name: string;
}

export interface FormatType {
  name: string;
}

export interface LightingType {
  name: string;
}

export interface ClientType {
  companyName: string;
  companyKindOfActivity: string;
  companyAddress: string;
  companyPhone: string;
  companyEmail: string;
  companySite: string;
  companyBirthday: string;
  CompanyManagementName: string;
  CompanyManagementJobTitle: string;
  CompanyManagementBirthday: string;
  contactPersonName: string;
  contactPersonJobTitle: string;
  contactPersonBirthday: string;
  advertisingChannel: string;
}

export interface ClientListType extends ClientType {
  _id: Types.ObjectId;
}

export interface BookingType {
  clientId: Schema.Types.ObjectId;
  locationId: Schema.Types.ObjectId;
  booking_date: [Schema.Types.Date];
}

export interface CommercialLinkType {
  location: string[];
  settings: {
    id: string;
    name: string;
    show: boolean;
  }[];
  description: string;
  title: string;
  shortUrl: string;
  fullLink: string;
}

export interface SizeType {
  name: string;
}

export interface RentData {
  date: DateRange | null;
  client: Schema.Types.ObjectId | null;
  rent_cost: string;
}

export interface RentHistoryType {
  location: Types.ObjectId;
  client: Types.ObjectId;
  rent_price: Types.Decimal128;
  rent_cost: Types.Decimal128;
  rent_date: IPeriod;
  createdAt: Date;
}

export interface RentHistoryListType extends RentHistoryType {
  _id: string;
}

export interface AnalClientType {
  client: ClientListType;
  anal: {
    date: IPeriod;
    total: string;
    month: string;
    locationId: string;
  }[];
  overallBudget: number;
  rentDay: number;
  numberOfBanners: number;
}

export interface INotification {
  message: string;
  subject: string;
  event: string;
  location: Types.ObjectId;
  readBy: Types.ObjectId[];
  deletedBy: Types.ObjectId[];
  createdAt: Date;
}

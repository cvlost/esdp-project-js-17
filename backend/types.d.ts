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
  region: Types.ObjectId;
}

export interface LegalEntityType {
  name: string;
}

export interface IPeriod {
  start: Date;
  end: Date;
}

export interface ILocation {
  client: Schema.Types.ObjectId;
  booking: Schema.Types.ObjectId;
  nearest_booking_date: [Schema.Types.Date];
  country: string;
  area: Types.ObjectId;
  region: Types.ObjectId;
  city: Types.ObjectId;
  street: Types.ObjectId;
  direction: Types.ObjectId;
  legalEntity: Types.ObjectId;
  format: Types.ObjectId;
  price: Types.Decimal128;
  rent: IPeriod | null;
  reserve: IPeriod | null;
  lighting: string;
  placement: boolean;
  size: string;
  addressNote?: string;
  description?: string;
  dayImage: File | string;
  schemaImage: File | string;
}

export interface AreaType {
  name: string;
}

export interface FormatType {
  name: string;
}

export interface ClientType {
  name: string;
  phone: string;
  email?: string;
  description?: string;
}

export interface BookingType {
  clientId: Schema.Types.ObjectId;
  locationId: Schema.Types.ObjectId;
  booking_date: [Schema.Types.Date];
}

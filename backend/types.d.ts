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
}

export interface DirectionType {
  name: string;
}

export interface StreetType {
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
  image?: string;
  addressNote?: string;
  description?: string;
}

export interface AreaType {
  name: string;
}

export interface FormatType {
  name: string;
}

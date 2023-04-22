import { Types } from 'mongoose';

export interface IUser {
  email: string;
  password: string;
  token: string;
  role: string;
  displayName: string;
}

export interface CityType {
  name: string;
}

export interface RegionType {
  name: string;
}

export interface DirectionType {
  name: string;
}

export interface ILocation {
  city: Types.ObjectId;
  region: Types.ObjectId;
  direction: Types.ObjectId;
  address: string;
  addressNote?: string;
  description?: string;
}

export interface AreaType {
  name: string;
}

export interface FormatType {
  name: string;
}

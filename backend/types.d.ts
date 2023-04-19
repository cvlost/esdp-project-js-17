import { Schema } from 'mongoose';

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
  city: Schema.Types.ObjectId;
  region: Schema.Types.ObjectId;
  direction: Schema.Types.ObjectId;
  address: string;
  addressNote?: string;
  description?: string;
}

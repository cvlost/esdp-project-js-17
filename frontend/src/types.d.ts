export interface User {
  _id: string;
  email: string;
  displayName: string;
  token: string;
  role: string;
}

export interface LoginMutation {
  email: string;
  password: string;
}

export interface UserResponse {
  message: string;
  user: User;
}

export interface RegisterResponse {
  message: string;
  user: User;
}

export interface UsersListResponse {
  users: User[];
  page: number;
  pages: number;
  perPage: number;
  count: number;
}

export interface UserMutation {
  email: string;
  password: string;
  role: string;
  displayName: string;
}

export interface IRole {
  prettyName: string;
  name: string;
}

export interface ValidationError {
  errors: {
    [key: string]: {
      message: string;
      name: string;
    };
  };
  message: string;
  name: string;
  _name: string;
}

export interface GlobalError {
  error: string;
}

export interface DeletedUserResponse {
  acknowledged: boolean;
  deletedCount: number;
}

export interface CityType {
  _id: string;
  name: string;
}

export interface RegionList {
  _id: string;
  name: string;
}

export interface CityMutation {
  name: string;
}

export interface RegionMutation {
  name: string;
}

export interface DirectionType {
  _id: string;
  name: string;
}

export type DirectionTypeMutation = Omit<DirectionType, '_id'>;

export interface ILocation {
  _id: string;
  city: CityType;
  direction: DirectionType;
  region: RegionList;
  address: string;
  addressNote?: string;
  description?: string;
}

export interface LocationsListResponse {
  locations: ILocation[];
  page: number;
  pages: number;
  perPage: number;
  count: number;
}

export interface FormatList {
  _id: string;
  name: string;
}

export type FormatMutation = Omit<FormatList, '_id'>;

export interface StreetList {
  _id: string;
  name: string;
}

export type StreetMutation = Omit<FormatList, '_id'>;

export interface AreaList {
  _id: string;
  name: string;
}
export type AreaMutation = Omit<AreaList, '_id'>;

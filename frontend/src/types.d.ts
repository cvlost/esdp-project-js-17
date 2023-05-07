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

export interface CityList {
  _id: string;
  name: string;
  area: string;
}

export interface CityMutation {
  name: string;
  area: string;
}

export interface RegionList {
  _id: string;
  name: string;
  area: string;
}

export interface RegionMutation {
  name: string;
}

export interface DirectionList {
  _id: string;
  name: string;
}

export type DirectionMutation = Omit<DirectionList, '_id'>;

export interface IPeriod {
  start: string;
  end: string;
}

export interface ILocation {
  _id: string;
  price: string;
  rent: null | IPeriod;
  reserve: null | IPeriod;
  city: string;
  area: string;
  street: string;
  direction: string;
  region: string;
  legalEntity: string;
  size: string;
  lighting: string;
  format: string;
  placement: boolean;
  country?: string;
  image?: string;
  addressNote?: string;
  description?: string;
}

export interface LocationsListResponse {
  locations: ILocation[];
  page: number;
  pages: number;
  perPage: number;
  count: number;
  filtered: boolean;
}

export interface FormatList {
  _id: string;
  name: string;
}

export type FormatMutation = Omit<FormatList, '_id'>;

export interface StreetList {
  _id: string;
  name: string;
  city: string;
}

export type StreetMutation = Omit<StreetList, '_id'>;

export interface AreaList {
  _id: string;
  name: string;
}

export type AreaMutation = Omit<AreaList, '_id'>;

export interface LegalEntityList {
  _id: string;
  name: string;
}

export type LegalEntityMutation = Omit<LegalEntityList, '_id'>;

export type DateRange = [Date, Date];

export interface LocationMutation {
  addressNote: string;
  description: string;
  country: string;
  area: string;
  region: string;
  city: string;
  street: string;
  direction: string;
  legalEntity: string;
  size: string;
  format: string;
  lighting: string;
  placement: boolean;
  price: string;
  dayImage: File | null;
  schemaImage: File | null;
}

export interface LocationSubmit {
  addressNote: string;
  description: string;
  country: string;
  area: string;
  region: string;
  city: string;
  street: string;
  direction: string;
  legalEntity: string;
  size: string;
  format: string;
  lighting: string;
  placement: boolean;
  price: string;
  dayImage: File | null;
  schemaImage: File | null;
}

/***** START: Filter types *****/

export interface StreetFilter {
  streets: StreetList[];
}

export interface AreaFilter {
  areas: AreaList[];
}

export interface CityFilter {
  cities: CityList[];
}

export interface FormatFilter {
  formats: FormatList[];
}

export interface DirectionFilter {
  directions: DirectionList[];
}

export interface RegionFilter {
  regions: RegionList[];
}

export interface LegalEntityFilter {
  legalEntities: LegalEntityList[];
}

export interface SizeFilter {
  sizes: string[];
}

export interface LightingFilter {
  lightings: string[];
}

export interface PlacementFilter {
  placement: string;
}

export interface RentFilter {
  rent: string;
}

export interface FilteredAction {
  filtered: boolean;
}

export type FilterEntity =
  | FilteredAction
  | RegionFilter
  | DirectionFilter
  | FormatFilter
  | CityFilter
  | AreaFilter
  | StreetFilter
  | LegalEntityFilter
  | LightingFilter
  | SizeFilter
  | PlacementFilter
  | RentFilter;

export type FilterState = { empty: boolean } & FilteredAction &
  RegionFilter &
  DirectionFilter &
  FormatFilter &
  CityFilter &
  AreaFilter &
  StreetFilter &
  LegalEntityFilter &
  LightingFilter &
  SizeFilter &
  PlacementFilter &
  RentFilter;

export type FilterCriteria = RegionFilter &
  DirectionFilter &
  FormatFilter &
  CityFilter &
  AreaFilter &
  StreetFilter &
  LegalEntityFilter &
  LightingFilter &
  SizeFilter;

interface FilterCriteriaResponse {
  count: number;
  locationsId: string[];
  priceRange: string[];
  criteria: FilterCriteria;
}

/***** END: Filter types *****/

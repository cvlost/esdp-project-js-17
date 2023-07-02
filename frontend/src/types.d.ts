import { DateRange } from 'rsuite/DateRangePicker';

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

export interface INotification {
  _id: string;
  message: string;
  event: string;
  createdAt: string;
  location: string;
  locationPrettyName: string;
  client: {
    companyName: string;
  };
  date: IPeriod;
}

export interface UserResponse {
  message: string;
  user: User;
  notifications: INotification[];
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
  city: string;
}

export interface RegionMutation {
  name: string;
  city: string;
}

export interface DirectionList {
  _id: string;
  name: string;
}

export type DirectionMutation = Omit<DirectionList, '_id'>;

export interface SizeList {
  _id: string;
  name: string;
}

export type SizeMutation = Omit<SizeList, '_id'>;

export interface LightingList {
  _id: string;
  name: string;
}

export type LightingMutation = Omit<LightingList, '_id'>;

export interface IPeriod {
  start: string;
  end: string;
}

export interface BookingMutation {
  clientId: string;
  locationId: string;
  booking_date: {
    start: Date;
    end: Date;
  };
}

export interface BookingListType {
  _id: string;
  clientId: string;
  locationId: string;
  booking_date: {
    start: string;
    end: string;
  };
}

export interface ILocation {
  _id: string;
  price: string;
  rent: null | IPeriod;
  city: string;
  area: string;
  streets: [string, string] | string[];
  direction: string;
  region: string;
  legalEntity: string;
  size: string;
  lighting: string;
  format: string;
  placement: boolean;
  country?: string;
  client?: string;
  dayImage?: string;
  schemaImage?: string;
  addressNote?: string;
  description?: string;
  checked: boolean;
  status: string | null;
  booking: BookingListType[];
  month: string;
  year: number;
  __v?: number;
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

export interface StreetMutation {
  name: string;
  city: string;
}

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

export interface LocationMutation {
  addressNote: string;
  description: string;
  country: string;
  area: string;
  region: string;
  city: string;
  streets: [string, string] | string[];
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

export interface ClientsList {
  _id: string;
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

export type ClientMutation = Omit<ClientsList, '_id'>;

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
  sizes: SizeList[];
}

export interface LightingFilter {
  lightings: LightingList[];
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

export interface GetItemsListType {
  areas: AreaList[];
  regions: RegionList[];
  directions: DirectionList[];
  legalEntity: LegalEntityList[];
  sizes: SizeList[];
  formats: FormatList[];
  lighting: LightingList[];
}

export interface CommercialLinkTypeMutation {
  location: string[];
  settings: {
    id: string;
    name: string;
    show: boolean;
  }[];
  description: string | null;
  title: string | null;
}

export interface CommercialLinkType {
  _id: string;
  location: string[];
  settings: {
    id: string;
    name: string;
    show: boolean;
  };
  shortUrl: string;
  fullLink: string;
  title: string;
  description: string;
}

export interface listLinkType {
  listLink: CommercialLinkType[];
  page: number;
  pages: number;
  perPage: number;
  listLinkLength: number;
}

export interface ConstructorLinkType {
  id: string;
  name: string;
  show: boolean;
}

export interface Link {
  fullLink: string | null;
}

export interface ILocationLink {
  _id: string;
  price: string | null;
  rent: null | IPeriod;
  city: string | null;
  area: string | null;
  streets: [string, string] | string[];
  direction: string | null;
  region: string | null;
  legalEntity: string | null;
  size: string | null;
  lighting: string | null;
  format: string | null;
  placement: boolean | null;
  country?: string;
  dayImage?: string;
  schemaImage?: string;
  addressNote?: string;
  description?: string;
  checked: boolean;
  client: string;
}

export interface contentLinkType {
  location: ILocationLink[];
  description: string;
  title: string;
}

export interface contentLinkOneType {
  location: ILocationLink | null;
  description: string;
  title: string;
}

export interface RentMutation {
  date: DateRange | null;
  client: string | null;
  rent_cost: string;
}

export interface RentHistoryList {
  _id: string;
  rent_date: IPeriod;
  client: ClientsList;
  location: ILocation;
  createdAt: Date;
  rent_cost: string;
  rent_price: string;
}

export interface AnalType {
  date: IPeriod;
  total: string;
  month: string;
  locationId: string;
}

export interface AnalClientType {
  _id: string;
  client: ClientsList;
  anal: AnalType[];
  overallBudget: number;
  rentDay: number;
  numberOfBanners: number;
}

export interface AnalClientList {
  clintAnalNew: AnalClientType[];
  page: number;
  pages: number;
  perPage: number;
  count: number;
}

export interface IData {
  tooltip: AnalType[] | BookingListType[];
  label: string;
  value: number;
  comp: JSX.Element | JSX.Element[];
}

export interface LocationGraphicType {
  _id: string;
  rent: null | IPeriod;
  booking: BookingListType[];
  client: string;
  month: string;
  year: number;
  price: number;
}

export interface LocationGraphicDateType {
  locations: LocationGraphicType[];
  page: number;
  pages: number;
  perPage: number;
  count: number;
}

export interface AnalyticsLocationType {
  _id: string;
  locationName: string;
  locationAddressNote: string;
  dayImage: string;
  overallBudget: number;
  overallPrice: number;
  rentDay: number;
  rentPercent: number;
  financePercent: number;
}

export interface AnalyticsLocationList {
  locationsAnalytics: AnalyticsLocationType[];
}

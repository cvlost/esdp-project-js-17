import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../../app/store';
import {
  FilterCriteriaResponse,
  FilterEntity,
  FilterState,
  ILocation,
  LocationsListResponse,
  ValidationError,
} from '../../types';
import {
  createLocation,
  getFilterCriteriaData,
  getLocationsList,
  getOneLocation,
  removeLocation,
} from './locationsThunks';

interface LocationColumn {
  id: string;
  name: string;
  prettyName: string;
  type: 'location' | 'billboard';
  show: boolean;
}

interface LocationsState {
  locationsListData: LocationsListResponse;
  locationsListLoading: boolean;
  settings: {
    columns: LocationColumn[];
    filter: FilterState;
  };
  filterCriteriaData: FilterCriteriaResponse;
  filterCriteriaLoading: boolean;
  oneLocation: ILocation | null;
  oneLocationLoading: boolean;
  createLocationLoading: boolean;
  createError: ValidationError | null;
  locationDeleteLoading: false | string;
}

export const initialColumns: LocationColumn[] = [
  { id: '1', name: 'address', prettyName: 'Полный адрес', show: true, type: 'location' },
  { id: '2', name: 'area', prettyName: 'Область', show: true, type: 'location' },
  { id: '3', name: 'city', prettyName: 'Город', show: true, type: 'location' },
  { id: '4', name: 'region', prettyName: 'Регион', show: true, type: 'location' },
  { id: '5', name: 'street', prettyName: 'Улица', show: true, type: 'location' },
  { id: '6', name: 'direction', prettyName: 'Направление', show: true, type: 'location' },
  { id: '7', name: 'legalEntity', prettyName: 'Юр. лицо', show: true, type: 'location' },
  { id: '8', name: 'size', prettyName: 'Размер', show: true, type: 'billboard' },
  { id: '9', name: 'format', prettyName: 'Формат', show: true, type: 'billboard' },
  { id: '10', name: 'lighting', prettyName: 'Освещение', show: true, type: 'billboard' },
  { id: '11', name: 'placement', prettyName: 'Расположение', show: true, type: 'billboard' },
  { id: '12', name: 'price', prettyName: 'Цена', show: true, type: 'billboard' },
  { id: '13', name: 'rent', prettyName: 'Аренда', show: true, type: 'billboard' },
  { id: '14', name: 'reserve', prettyName: 'Бронь', show: true, type: 'billboard' },
];

const initialFilterState: FilterState = {
  streets: [],
  areas: [],
  cities: [],
  regions: [],
  directions: [],
  formats: [],
  sizes: [],
  legalEntities: [],
  lightings: [],
};

const initialFilterCriteria: FilterCriteriaResponse = {
  count: 0,
  priceRange: [],
  locationsId: [],
  criteria: {
    streets: [],
    areas: [],
    cities: [],
    regions: [],
    directions: [],
    formats: [],
    sizes: [],
    lightings: [],
    legalEntities: [],
  },
};

const initialState: LocationsState = {
  locationsListData: {
    locations: [],
    filtered: false,
    page: 1,
    pages: 1,
    count: 0,
    perPage: 10,
  },
  locationsListLoading: false,
  settings: {
    columns: initialColumns,
    filter: initialFilterState,
  },
  filterCriteriaData: initialFilterCriteria,
  filterCriteriaLoading: false,
  oneLocation: null,
  oneLocationLoading: false,
  createLocationLoading: false,
  createError: null,
  locationDeleteLoading: false,
};

const locationsSlice = createSlice({
  name: 'locations',
  initialState,
  reducers: {
    setCurrentPage: (state, { payload: page }: PayloadAction<number>) => {
      state.locationsListData.page = page;
    },
    setPerPage: (state, { payload: perPage }: PayloadAction<number>) => {
      state.locationsListData.perPage = perPage;
    },
    toggleColumn: (state, { payload: id }: PayloadAction<string>) => {
      const index = state.settings.columns.findIndex((col) => col.id === id);
      state.settings.columns[index].show = !state.settings.columns[index].show;
    },
    setFilter: (state, { payload }: PayloadAction<FilterEntity>) => {
      state.settings.filter = { ...state.settings.filter, ...payload };
    },
    resetFilter: (state) => {
      state.settings.filter = initialFilterState;
      state.locationsListData.filtered = false;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(getLocationsList.pending, (state) => {
      state.locationsListLoading = true;
    });
    builder.addCase(getLocationsList.fulfilled, (state, { payload }) => {
      state.locationsListData = payload;
      state.locationsListLoading = false;
    });
    builder.addCase(getLocationsList.rejected, (state) => {
      state.locationsListLoading = false;
    });

    builder.addCase(getOneLocation.pending, (state) => {
      state.oneLocation = null;
      state.oneLocationLoading = true;
    });
    builder.addCase(getOneLocation.fulfilled, (state, { payload: loc }) => {
      state.oneLocation = loc;
      state.oneLocationLoading = false;
    });
    builder.addCase(getOneLocation.rejected, (state) => {
      state.oneLocationLoading = false;
    });

    builder.addCase(createLocation.pending, (state) => {
      state.createLocationLoading = true;
    });
    builder.addCase(createLocation.fulfilled, (state) => {
      state.createLocationLoading = false;
    });
    builder.addCase(createLocation.rejected, (state, { payload: error }) => {
      state.createLocationLoading = false;
      state.createError = error || null;
    });

    builder.addCase(removeLocation.pending, (state, { meta: { arg: id } }) => {
      state.locationDeleteLoading = id;
    });
    builder.addCase(removeLocation.fulfilled, (state) => {
      state.locationDeleteLoading = false;
    });
    builder.addCase(removeLocation.rejected, (state) => {
      state.locationDeleteLoading = false;
    });

    builder.addCase(getFilterCriteriaData.pending, (state) => {
      state.filterCriteriaLoading = true;
    });
    builder.addCase(getFilterCriteriaData.fulfilled, (state, { payload: data }) => {
      state.filterCriteriaData = data;
      state.filterCriteriaLoading = false;
    });
    builder.addCase(getFilterCriteriaData.rejected, (state) => {
      state.filterCriteriaLoading = false;
    });
  },
});

export const locationsReducer = locationsSlice.reducer;
export const { setCurrentPage, setPerPage, toggleColumn, setFilter, resetFilter } = locationsSlice.actions;

export const selectLocationsListData = (state: RootState) => state.locations.locationsListData;
export const selectLocationsListLoading = (state: RootState) => state.locations.locationsListLoading;
export const selectLocationsColumnSettings = (state: RootState) => state.locations.settings.columns;
export const selectOneLocation = (state: RootState) => state.locations.oneLocation;
export const selectOneLocationLoading = (state: RootState) => state.locations.oneLocationLoading;
export const selectCreateLocationLoading = (state: RootState) => state.locations.createLocationLoading;
export const selectCreateLocationError = (state: RootState) => state.locations.createError;
export const selectLocationsDeleteLoading = (state: RootState) => state.locations.locationDeleteLoading;
export const selectLocationsFilter = (state: RootState) => state.locations.settings.filter;
export const selectLocationsFilterCriteriaData = (state: RootState) => state.locations.filterCriteriaData;
export const selectLocationsFilterCriteriaLoading = (state: RootState) => state.locations.filterCriteriaLoading;

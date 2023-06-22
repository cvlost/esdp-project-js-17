import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../../app/store';
import {
  FilterCriteriaResponse,
  FilterEntity,
  FilterState,
  ILocation,
  LocationsListResponse,
  ValidationError,
  LocationMutation,
  GetItemsListType,
} from '../../types';
import {
  createLocation,
  getFilterCriteriaData,
  getLocationsList,
  getOneLocation,
  removeLocation,
  updateLocation,
  getToEditOneLocation,
  checkedLocation,
  getItems,
  createBooking,
  removeBooking,
  updateRent,
  clearRent,
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
  oneLocationEdit: LocationMutation | null;
  oneLocationEditLoading: boolean;
  oneLocationEditError: ValidationError | null;
  createLocationLoading: boolean;
  createError: ValidationError | null;
  locationDeleteLoading: false | string;
  selectedLocationId: string[];
  openSelected: boolean;
  checkedLocationLoading: false | string;
  itemsList: GetItemsListType;
  getItemsListLoading: boolean;
  createRentLoading: boolean;
  createRentError: ValidationError | null;
  clearRentLoading: boolean;
  createBookingLoading: boolean;
  createBookingError: ValidationError | null;
  removeBookingLoading: string | false;
}

export const initialColumns: LocationColumn[] = [
  { id: '15', name: 'status', prettyName: 'Статус', show: true, type: 'billboard' },
  { id: '1', name: 'address', prettyName: 'Полный адрес', show: true, type: 'location' },
  { id: '2', name: 'area', prettyName: 'Область', show: true, type: 'location' },
  { id: '3', name: 'city', prettyName: 'Город', show: true, type: 'location' },
  { id: '4', name: 'region', prettyName: 'Район', show: true, type: 'location' },
  { id: '5', name: 'streets', prettyName: 'Улица', show: true, type: 'location' },
  { id: '6', name: 'direction', prettyName: 'Направление', show: true, type: 'location' },
  { id: '7', name: 'legalEntity', prettyName: 'Юр. лицо', show: true, type: 'location' },
  { id: '8', name: 'size', prettyName: 'Размер', show: true, type: 'billboard' },
  { id: '9', name: 'format', prettyName: 'Формат', show: true, type: 'billboard' },
  { id: '10', name: 'lighting', prettyName: 'Освещение', show: true, type: 'billboard' },
  { id: '11', name: 'placement', prettyName: 'Расположение', show: true, type: 'billboard' },
  { id: '12', name: 'price', prettyName: 'Цена', show: true, type: 'billboard' },
  { id: '13', name: 'rent', prettyName: 'Аренда', show: true, type: 'billboard' },
  { id: '16', name: 'booking', prettyName: 'Бронь', show: true, type: 'billboard' },
];

const initialFilterState: FilterState = {
  filtered: false,
  empty: true,
  streets: [],
  areas: [],
  cities: [],
  regions: [],
  directions: [],
  formats: [],
  sizes: [],
  legalEntities: [],
  lightings: [],
  rent: 'all',
  placement: 'all',
};

const isFilterEmpty = (filter: FilterState) => {
  return (
    !filter.streets.length &&
    !filter.areas.length &&
    !filter.cities.length &&
    !filter.regions.length &&
    !filter.directions.length &&
    !filter.formats.length &&
    !filter.sizes.length &&
    !filter.legalEntities.length &&
    !filter.lightings.length &&
    filter.rent === 'all' &&
    filter.placement === 'all'
  );
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
    page: 1,
    pages: 1,
    count: 0,
    perPage: 10,
    filtered: false,
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
  oneLocationEdit: null,
  oneLocationEditLoading: false,
  oneLocationEditError: null,
  selectedLocationId: [],
  openSelected: false,
  checkedLocationLoading: false,
  itemsList: {
    areas: [],
    regions: [],
    directions: [],
    legalEntity: [],
    sizes: [],
    formats: [],
    lighting: [],
  },
  getItemsListLoading: false,
  createRentLoading: false,
  createRentError: null,
  clearRentLoading: false,
  createBookingLoading: false,
  createBookingError: null,
  removeBookingLoading: false,
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
      state.settings.filter.empty = isFilterEmpty(state.settings.filter);
    },
    resetFilter: (state) => {
      state.settings.filter = initialFilterState;
      state.locationsListData.filtered = false;
    },
    addLocationId: (state) => {
      state.locationsListData.locations.filter((item) => {
        if (item.checked === true) {
          const index = state.selectedLocationId.indexOf(item._id);
          if (index === -1) state.selectedLocationId.push(item._id);
        } else if (item.checked === false) {
          const index = state.selectedLocationId.indexOf(item._id);
          if (index > -1) state.selectedLocationId.splice(index, 1);
        }
      });
    },
    resetLocationId: (state) => {
      state.selectedLocationId = [];
    },
  },
  extraReducers: (builder) => {
    builder.addCase(getItems.pending, (state) => {
      state.getItemsListLoading = true;
    });
    builder.addCase(getItems.fulfilled, (state, { payload: listItems }) => {
      state.itemsList = listItems;
      state.getItemsListLoading = false;
    });
    builder.addCase(getItems.rejected, (state) => {
      state.getItemsListLoading = false;
    });

    builder.addCase(checkedLocation.pending, (state, { meta: { arg: id } }) => {
      state.checkedLocationLoading = id.id ? id.id : '';
    });
    builder.addCase(checkedLocation.fulfilled, (state) => {
      state.checkedLocationLoading = false;
    });
    builder.addCase(checkedLocation.rejected, (state) => {
      state.checkedLocationLoading = false;
    });

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
      state.createError = null;
      state.createLocationLoading = true;
    });
    builder.addCase(createLocation.fulfilled, (state) => {
      state.createLocationLoading = false;
    });
    builder.addCase(createLocation.rejected, (state, { payload: error }) => {
      state.createLocationLoading = false;
      state.createError = error || null;
    });
    builder.addCase(clearRent.pending, (state) => {
      state.clearRentLoading = true;
    });
    builder.addCase(clearRent.fulfilled, (state, { payload: location }) => {
      state.clearRentLoading = false;
      const locationId = location._id;
      const foundLocationIndex = state.locationsListData.locations.findIndex((loc) => loc._id === locationId);
      if (foundLocationIndex !== -1) {
        state.locationsListData.locations[foundLocationIndex] = location;
      } else {
        return;
      }
    });
    builder.addCase(clearRent.rejected, (state) => {
      state.clearRentLoading = false;
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
    builder.addCase(getToEditOneLocation.pending, (state) => {
      state.oneLocationEdit = null;
    });
    builder.addCase(getToEditOneLocation.fulfilled, (state, { payload: loc }) => {
      state.oneLocationEdit = loc;
    });
    builder.addCase(getToEditOneLocation.rejected, (state) => {
      state.oneLocationEditLoading = false;
    });

    builder.addCase(updateLocation.pending, (state) => {
      state.oneLocationEditError = null;
      state.oneLocationEditLoading = true;
    });
    builder.addCase(updateLocation.fulfilled, (state) => {
      state.oneLocationEditLoading = false;
    });
    builder.addCase(updateLocation.rejected, (state, { payload: error }) => {
      state.oneLocationEditError = error || null;
      state.oneLocationEditLoading = false;
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
    builder.addCase(updateRent.pending, (state) => {
      state.createRentLoading = true;
    });
    builder.addCase(updateRent.fulfilled, (state) => {
      state.createRentLoading = false;
    });
    builder.addCase(updateRent.rejected, (state, { payload: error }) => {
      state.createRentLoading = false;
      state.createRentError = error || null;
    });

    builder.addCase(createBooking.pending, (state) => {
      state.createBookingLoading = true;
    });
    builder.addCase(createBooking.fulfilled, (state) => {
      state.createBookingLoading = false;
    });
    builder.addCase(createBooking.rejected, (state, { payload: error }) => {
      state.createBookingLoading = false;
      state.createBookingError = error || null;
    });

    builder.addCase(removeBooking.pending, (state, { meta: { arg: id } }) => {
      state.removeBookingLoading = id.idBook;
    });
    builder.addCase(removeBooking.fulfilled, (state) => {
      state.removeBookingLoading = false;
    });
    builder.addCase(removeBooking.rejected, (state) => {
      state.removeBookingLoading = false;
    });
  },
});

export const locationsReducer = locationsSlice.reducer;

export const { setCurrentPage, setPerPage, toggleColumn, setFilter, resetFilter, addLocationId, resetLocationId } =
  locationsSlice.actions;
export const selectLocationsListData = (state: RootState) => state.locations.locationsListData;
export const selectLocationsListLoading = (state: RootState) => state.locations.locationsListLoading;
export const selectLocationsColumnSettings = (state: RootState) => state.locations.settings.columns;
export const selectOneLocation = (state: RootState) => state.locations.oneLocation;
export const selectOneLocationLoading = (state: RootState) => state.locations.oneLocationLoading;
export const selectOneLocationToEdit = (state: RootState) => state.locations.oneLocationEdit;
export const selectOneLocationEditLoading = (state: RootState) => state.locations.oneLocationEditLoading;
export const selectEditLocationError = (state: RootState) => state.locations.oneLocationEditError;
export const selectCreateLocationLoading = (state: RootState) => state.locations.createLocationLoading;
export const selectCreateLocationError = (state: RootState) => state.locations.createError;
export const selectLocationsDeleteLoading = (state: RootState) => state.locations.locationDeleteLoading;
export const selectLocationsFilter = (state: RootState) => state.locations.settings.filter;
export const selectLocationsFilterCriteriaData = (state: RootState) => state.locations.filterCriteriaData;
export const selectLocationsFilterCriteriaLoading = (state: RootState) => state.locations.filterCriteriaLoading;
export const selectCheckedLocationLoading = (state: RootState) => state.locations.checkedLocationLoading;
export const selectSelectedLocationId = (state: RootState) => state.locations.selectedLocationId;
export const selectItemsList = (state: RootState) => state.locations.itemsList;
export const selectGetItemsListLoading = (state: RootState) => state.locations.getItemsListLoading;
export const selectCreateRentLoading = (state: RootState) => state.locations.createRentLoading;
export const selectCreateRentError = (state: RootState) => state.locations.createRentError;
export const selectCreateBookingLoading = (state: RootState) => state.locations.createBookingLoading;
export const selectCreateBookingError = (state: RootState) => state.locations.createBookingError;
export const selectRemoveBookingLoading = (state: RootState) => state.locations.removeBookingLoading;

import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../../app/store';
import { LocationsListResponse } from '../../types';
import { getLocationsList } from './locationsThunks';

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
  };
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

const initialState: LocationsState = {
  locationsListData: {
    locations: [],
    page: 1,
    pages: 1,
    count: 0,
    perPage: 10,
  },
  locationsListLoading: false,
  settings: {
    columns: initialColumns,
  },
};

const locationsSlice = createSlice({
  name: 'locations',
  initialState,
  reducers: {
    setCurrentPage: (state, { payload: page }: PayloadAction<number>) => {
      state.locationsListData.page = page;
    },
    toggleColumn: (state, { payload: id }: PayloadAction<string>) => {
      const index = state.settings.columns.findIndex((col) => col.id === id);
      state.settings.columns[index].show = !state.settings.columns[index].show;
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
  },
});

export const locationsReducer = locationsSlice.reducer;
export const { setCurrentPage, toggleColumn } = locationsSlice.actions;

export const selectLocationsListData = (state: RootState) => state.locations.locationsListData;
export const selectLocationsListLoading = (state: RootState) => state.locations.locationsListLoading;
export const selectLocationsColumnSettings = (state: RootState) => state.locations.settings.columns;

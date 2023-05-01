import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../../../app/store';
import { createCity, fetchCities, removeCity } from './cityThunk';
import { CityList, GlobalError, ValidationError } from '../../../types';

interface CityState {
  cityList: CityList[];
  getAllListCityLoading: boolean;
  createCityLoading: boolean;
  removeCityLoading: boolean;
  cityError: null | ValidationError;
  errorRemove: GlobalError | null;
  modal: boolean;
}

const initialState: CityState = {
  cityList: [],
  getAllListCityLoading: false,
  createCityLoading: false,
  removeCityLoading: false,
  cityError: null,
  errorRemove: null,
  modal: false,
};

export const citySlice = createSlice({
  name: 'city',
  initialState,
  reducers: {
    controlModal: (state, { payload: type }: PayloadAction<boolean>) => {
      state.modal = type;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchCities.pending, (state) => {
      state.getAllListCityLoading = true;
    });
    builder.addCase(fetchCities.fulfilled, (state, { payload: cityList }) => {
      state.getAllListCityLoading = false;
      state.cityList = cityList;
    });
    builder.addCase(fetchCities.rejected, (state) => {
      state.getAllListCityLoading = false;
    });

    builder.addCase(createCity.pending, (state) => {
      state.createCityLoading = true;
    });
    builder.addCase(createCity.fulfilled, (state) => {
      state.createCityLoading = false;
    });
    builder.addCase(createCity.rejected, (state, { payload: error }) => {
      state.createCityLoading = false;
      state.cityError = error || null;
    });

    builder.addCase(removeCity.pending, (state) => {
      state.removeCityLoading = true;
    });
    builder.addCase(removeCity.fulfilled, (state) => {
      state.removeCityLoading = false;
    });
    builder.addCase(removeCity.rejected, (state, { payload: error }) => {
      state.removeCityLoading = false;
      state.errorRemove = error || null;
      state.modal = true;
    });
  },
});

export const cityReducer = citySlice.reducer;
export const { controlModal } = citySlice.actions;
export const selectCityList = (state: RootState) => state.city.cityList;
export const selectGetAllCitiesLoading = (state: RootState) => state.city.getAllListCityLoading;
export const selectCreateCityLoading = (state: RootState) => state.city.createCityLoading;
export const selectRemoveCityLoading = (state: RootState) => state.city.removeCityLoading;
export const selectCityError = (state: RootState) => state.city.cityError;
export const selectErrorRemove = (state: RootState) => state.city.errorRemove;
export const selectModal = (state: RootState) => state.city.modal;

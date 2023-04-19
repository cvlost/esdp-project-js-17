import { createSlice } from '@reduxjs/toolkit';
import { RootState } from '../../../app/store';
import { createCity, fetchCities, removeCity } from './cityThunk';
import { CityType, ValidationError } from '../../../types';

interface CityState {
  cityList: CityType[];
  getAllListCityLoading: boolean;
  createCityLoading: boolean;
  removeCityLoading: boolean;
  cityError: null | ValidationError;
}

const initialState: CityState = {
  cityList: [],
  getAllListCityLoading: false,
  createCityLoading: false,
  removeCityLoading: false,
  cityError: null,
};

export const citySlice = createSlice({
  name: 'city',
  initialState,
  reducers: {},
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
    builder.addCase(removeCity.rejected, (state) => {
      state.removeCityLoading = false;
    });
  },
});

export const cityReducer = citySlice.reducer;
export const selectCityList = (state: RootState) => state.city.cityList;
export const selectGetAllCitiesLoading = (state: RootState) => state.city.getAllListCityLoading;
export const selectCreateCityLoading = (state: RootState) => state.city.createCityLoading;
export const selectRemoveCityLoading = (state: RootState) => state.city.removeCityLoading;
export const selectCityError = (state: RootState) => state.city.cityError;

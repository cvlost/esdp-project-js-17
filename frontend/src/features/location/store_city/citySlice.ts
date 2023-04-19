import { createSlice } from '@reduxjs/toolkit';
import { RootState } from '../../../app/store';

interface CityState {
  cityList: CityState[];
  getAllListCityLoading: boolean;
  createCityLoading: boolean;
  removeCityLoading: boolean;
}

const initialState: CityState = {
  cityList: [],
  getAllListCityLoading: false,
  createCityLoading: false,
  removeCityLoading: false,
};

export const citySlice = createSlice({
  name: 'city',
  initialState,
  reducers: {},
  extraReducers: {},
});

export const cityReducer = citySlice.reducer;
export const selectCityList = (state: RootState) => state.city.cityList;
export const selectGetAllCitiesLoading = (state: RootState) => state.city.getAllListCityLoading;
export const selectCreateCityLoading = (state: RootState) => state.city.createCityLoading;
export const selectRemoveCityLoading = (state: RootState) => state.city.removeCityLoading;

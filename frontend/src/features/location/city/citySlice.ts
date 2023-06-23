import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../../../app/store';
import { createCity, fetchCities, fetchOneCity, removeCity, updateCity } from './cityThunk';
import { CityList, GlobalError, ValidationError } from '../../../types';
interface CityState {
  cityList: CityList[];
  getAllListCityLoading: boolean;
  createCityLoading: boolean;
  removeCityLoading: string | false;
  cityError: null | ValidationError;
  errorRemove: GlobalError | null;
  modal: boolean;
  oneCity: null | CityList;
  updateCityLoading: boolean;
  oneCityLoading: boolean;
}

const initialState: CityState = {
  cityList: [],
  getAllListCityLoading: false,
  createCityLoading: false,
  removeCityLoading: false,
  cityError: null,
  errorRemove: null,
  modal: false,
  oneCity: null,
  updateCityLoading: false,
  oneCityLoading: false,
};

export const citySlice = createSlice({
  name: 'city',
  initialState,
  reducers: {
    controlModal: (state, { payload: type }: PayloadAction<boolean>) => {
      state.modal = type;
    },
    unsetCity: (state) => {
      state.oneCity = null;
    },
    setCity: (state, action) => {
      state.oneCity = action.payload;
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
    builder.addCase(fetchOneCity.pending, (state) => {
      state.oneCityLoading = true;
    });
    builder.addCase(fetchOneCity.fulfilled, (state, { payload: city }) => {
      state.oneCityLoading = false;
      state.oneCity = city;
    });
    builder.addCase(fetchOneCity.rejected, (state) => {
      state.oneCityLoading = false;
    });

    builder.addCase(updateCity.pending, (state) => {
      state.updateCityLoading = true;
    });
    builder.addCase(updateCity.fulfilled, (state) => {
      state.updateCityLoading = false;
    });
    builder.addCase(updateCity.rejected, (state, { payload: error }) => {
      state.updateCityLoading = false;
      state.cityError = error || null;
    });

    builder.addCase(removeCity.pending, (state, { meta: { arg: id } }) => {
      state.removeCityLoading = id;
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
export const { setCity, unsetCity } = citySlice.actions;

export const cityReducer = citySlice.reducer;
export const { controlModal } = citySlice.actions;
export const selectCityList = (state: RootState) => state.city.cityList;
export const selectGetAllCitiesLoading = (state: RootState) => state.city.getAllListCityLoading;
export const selectCreateCityLoading = (state: RootState) => state.city.createCityLoading;
export const selectRemoveCityLoading = (state: RootState) => state.city.removeCityLoading;
export const selectCityError = (state: RootState) => state.city.cityError;
export const selectErrorRemove = (state: RootState) => state.city.errorRemove;
export const selectModal = (state: RootState) => state.city.modal;
export const selectOneCity = (state: RootState) => state.city.oneCity;
export const selectOneCityLoading = (state: RootState) => state.city.oneCityLoading;
export const selectUpdateCityLoading = (state: RootState) => state.city.updateCityLoading;

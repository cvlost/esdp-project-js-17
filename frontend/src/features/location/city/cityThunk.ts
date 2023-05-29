import { createAsyncThunk } from '@reduxjs/toolkit';
import { CityMutation, CityList, ValidationError, GlobalError, RegionList, RegionMutation } from '../../../types';
import axiosApi from '../../../axios';
import { isAxiosError } from 'axios';
import { AppDispatch, RootState } from '../../../app/store';
import { setRegion } from '../region/regionSlice';
import { setCity } from './citySlice';

export const fetchCities = createAsyncThunk<CityList[], string | undefined>('city/fetch_cities', async (id) => {
  const response = await axiosApi.get<CityList[]>(id ? '/cities?areaId=' + id : '/cities');
  return response.data;
});

export const fetchOneCity = createAsyncThunk<CityList, string>('city/fetchOne', async (id) => {
  const response = await axiosApi.get<CityList | null>('/cities/' + id);
  if (response.data === null) {
    throw new Error('not found');
  }
  return response.data;
});

interface UpdateParams {
  id: string;
  name: CityMutation;
}

export const updateCity = createAsyncThunk<
  void,
  UpdateParams,
  { rejectValue: ValidationError; dispatch: AppDispatch; state: RootState }
>('city/update', async (params, { rejectWithValue, dispatch, getState }) => {
  try {
    const current = getState().city.oneCity;
    const response = await axiosApi.put('/cities/' + params.id, params.name);
    if (current && current._id === params.id) {
      dispatch(setCity(response.data));
    }
  } catch (e) {
    if (isAxiosError(e) && e.response && e.response.status === 400) {
      return rejectWithValue(e.response.data as ValidationError);
    }
    throw e;
  }
});

export const createCity = createAsyncThunk<void, CityMutation, { rejectValue: ValidationError }>(
  'city/create_city',
  async (cityMutation, { rejectWithValue }) => {
    try {
      await axiosApi.post('/cities', cityMutation);
    } catch (e) {
      if (isAxiosError(e) && e.response && e.response.status === 400) {
        return rejectWithValue(e.response.data as ValidationError);
      }
      throw e;
    }
  },
);

export const removeCity = createAsyncThunk<void, string, { rejectValue: GlobalError }>(
  'city/remove_city',
  async (id, { rejectWithValue }) => {
    try {
      await axiosApi.delete('/cities/' + id);
    } catch (e) {
      if (isAxiosError(e) && e.response && e.response.status === 404) {
        return rejectWithValue(e.response.data as GlobalError);
      }
      throw e;
    }
  },
);

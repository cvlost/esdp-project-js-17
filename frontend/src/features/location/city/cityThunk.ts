import { createAsyncThunk } from '@reduxjs/toolkit';
import { CityMutation, CityList, ValidationError, GlobalError } from '../../../types';
import axiosApi from '../../../axios';
import { isAxiosError } from 'axios';

export const fetchCities = createAsyncThunk<CityList[]>('city/fetch_cities', async () => {
  const response = await axiosApi.get<CityList[]>('/cities');
  return response.data;
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

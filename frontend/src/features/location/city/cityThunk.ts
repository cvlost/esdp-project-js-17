import { createAsyncThunk } from '@reduxjs/toolkit';
import { CityMutation, CityType, ValidationError } from '../../../types';
import axiosApi from '../../../axios';
import { isAxiosError } from 'axios';

export const fetchCities = createAsyncThunk<CityType[]>('city/fetch_cities', async () => {
  const response = await axiosApi.get<CityType[]>('/cities');
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

export const removeCity = createAsyncThunk<void, string>('city/remove_city', async (id) => {
  await axiosApi.delete('/cities/' + id);
});

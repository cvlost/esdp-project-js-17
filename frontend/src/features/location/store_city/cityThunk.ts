import { createAsyncThunk } from '@reduxjs/toolkit';
import { CityType } from '../../../types';
import axiosApi from '../../../axios';

export const fetchCities = createAsyncThunk<CityType[]>('city/fetch_cities', async () => {
  const response = await axiosApi.get<CityType[]>('/cities');
  return response.data;
});

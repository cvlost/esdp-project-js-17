import { createAsyncThunk } from '@reduxjs/toolkit';
import { ILocation, LocationsListResponse } from '../../types';
import axiosApi from '../../axios';

type RequestParams = { page: number; perPage: number } | undefined;

export const getLocationsList = createAsyncThunk<LocationsListResponse, RequestParams>(
  'locations/getAll',
  async (params) => {
    let queryString = '';
    if (params) {
      queryString = `?page=${params.page}&perPage=${params.perPage}`;
    }
    const response = await axiosApi.get<LocationsListResponse>(`/locations${queryString}`);
    return response.data;
  },
);

export const getOneLocation = createAsyncThunk<ILocation, string>('locations/getOne', async (id) => {
  const response = await axiosApi.get(`/locations/${id}`);
  return response.data;
});

export const removeLocation = createAsyncThunk<void, string>('locations/remove_location', async (id) => {
  await axiosApi.delete('/locations/' + id);
});

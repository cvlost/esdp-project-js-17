import { createAsyncThunk } from '@reduxjs/toolkit';
import { LocationsListResponse } from '../../types';
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

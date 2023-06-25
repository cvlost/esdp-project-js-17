import { createAsyncThunk } from '@reduxjs/toolkit';
import { LocationGraphicDateType } from '../../../types';
import axiosApi from '../../../axios';

type RequestParams = { page: number; perPage: number; filterYear?: number; filterMonth?: string } | undefined;

export const fetchLocationGraphic = createAsyncThunk<LocationGraphicDateType, RequestParams>(
  'locationGraphic/locationGraphicFetch',
  async (params) => {
    const queryString = params
      ? `?page=${params.page}&perPage=${params.perPage}&filterYear=${params.filterYear}&filterMonth=${params.filterMonth}`
      : '';
    const response = await axiosApi.get<LocationGraphicDateType>(`/locations/list-graphic${queryString}`);
    return response.data;
  },
);

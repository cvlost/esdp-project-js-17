import { createAsyncThunk } from '@reduxjs/toolkit';
import axiosApi from '../../axios';
import { AnalyticsLocationList } from '../../types';

type RequestParams = { page: number; perPage: number; filter: number } | undefined;

export const fetchAnalyticLocList = createAsyncThunk<AnalyticsLocationList, RequestParams>(
  'analyticLoc/fetchAnalyticLocList',
  async (params) => {
    const queryString = params ? `?filter=${params.filter}&page=${params.page}&perPage=${params.perPage}` : '';
    const response = await axiosApi.get<AnalyticsLocationList>(`/locations/analytics${queryString}`);
    return response.data;
  },
);

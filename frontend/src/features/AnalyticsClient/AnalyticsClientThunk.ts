import { createAsyncThunk } from '@reduxjs/toolkit';
import { AnalClientList } from '../../types';
import axiosApi from '../../axios';

type RequestParams = { page: number; perPage: number; filter: number; constantClient: boolean } | undefined;

export const fetchAnalyticClientList = createAsyncThunk<AnalClientList, RequestParams>(
  'analyticClient/fetchAnalyticClientList',
  async (params) => {
    const queryString = params
      ? `?filter=${params.filter}&constantClient=${params.constantClient}&page=${params.page}&perPage=${params.perPage}`
      : '';
    const response = await axiosApi.get<AnalClientList>(`/clients/anal${queryString}`);
    return response.data;
  },
);

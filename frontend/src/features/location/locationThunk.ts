import { createAsyncThunk } from '@reduxjs/toolkit';
import { RegionList } from '../../types';
import axiosApi from '../../axios';

export const fetchRegions = createAsyncThunk<RegionList[]>('location/fetch_regions', async () => {
  const response = await axiosApi.get<RegionList[]>('/region');
  return response.data;
});

import { createAsyncThunk } from '@reduxjs/toolkit';
import { AreaList } from '../../../types';
import axiosApi from '../../../axios';

export const fetchAreas = createAsyncThunk<AreaList[]>('area/fetch_areas', async () => {
  const response = await axiosApi.get<AreaList[]>('/areas');
  return response.data;
});

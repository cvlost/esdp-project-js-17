import { createAsyncThunk } from '@reduxjs/toolkit';
import axiosApi from '../../../axios';
import { SizeMutation, GlobalError, SizeList, ValidationError, LightingList } from '../../../types';
import { isAxiosError } from 'axios';
import { AppDispatch, RootState } from '../../../app/store';
import { setSize } from './sizeSlice';
import { handleAxiosError } from '../../handleAxiosError';

export const getSizesList = createAsyncThunk<SizeList[]>('sizes/fetchAll', async () => {
  const response = await axiosApi.get('/sizes');
  return response.data;
});

export const fetchOneSize = createAsyncThunk<SizeList, string>('sizes/fetchOne', async (id) => {
  const response = await axiosApi.get<LightingList | null>('/sizes/' + id);
  if (response.data === null) {
    throw new Error('not found');
  }
  return response.data;
});

interface UpdateParams {
  id: string;
  name: SizeMutation;
}

export const updateSize = createAsyncThunk<
  void,
  UpdateParams,
  { rejectValue: ValidationError; dispatch: AppDispatch; state: RootState }
>('lighting/update', async (params, { rejectWithValue, dispatch, getState }) => {
  try {
    const current = getState().size.oneSize;
    const response = await axiosApi.put('/sizes/' + params.id, params.name);
    if (current && current._id === params.id) {
      dispatch(setSize(response.data));
    }
  } catch (e) {
    if (isAxiosError(e) && e.response && e.response.status === 400) {
      return rejectWithValue(e.response.data as ValidationError);
    }
    throw e;
  }
});

export const deleteSize = createAsyncThunk<void, string, { rejectValue: GlobalError }>(
  'sizes/delete',
  async (sizeID, { rejectWithValue }) => {
    try {
      await axiosApi.delete('/sizes/' + sizeID);
    } catch (e) {
      if (isAxiosError(e) && e.response && e.response.status === 404) {
        return rejectWithValue(e.response.data as GlobalError);
      }
      throw e;
    }
  },
);

export const createSize = createAsyncThunk<void, SizeMutation, { rejectValue: ValidationError }>(
  'sizes/create',
  async (sizeData, { rejectWithValue }) => {
    try {
      const comment = await axiosApi.post('/sizes', sizeData);
      return comment.data;
    } catch (e) {
      handleAxiosError(e, rejectWithValue);
    }
  },
);

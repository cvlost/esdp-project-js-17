import { createAsyncThunk } from '@reduxjs/toolkit';
import { FormatList, FormatMutation, GlobalError, ValidationError } from '../../../types';
import axiosApi from '../../../axios';
import { isAxiosError } from 'axios';
import { AppDispatch, RootState } from '../../../app/store';
import { setFormat } from './formatSlice';
import { handleAxiosError } from '../../handleAxiosError';

export const fetchFormat = createAsyncThunk<FormatList[]>('format/fetch_formats', async () => {
  const response = await axiosApi.get<FormatList[]>('/formats');
  return response.data;
});

export const fetchOneFormat = createAsyncThunk<FormatList, string>('format/fetchOne', async (id) => {
  const response = await axiosApi.get<FormatList | null>('/formats/' + id);
  if (response.data === null) {
    throw new Error('not found');
  }
  return response.data;
});

interface UpdateFormatParams {
  id: string;
  area: FormatMutation;
}

export const updateFormat = createAsyncThunk<
  void,
  UpdateFormatParams,
  { rejectValue: ValidationError; dispatch: AppDispatch; state: RootState }
>('format/update', async (params, { rejectWithValue, dispatch, getState }) => {
  try {
    const currentFormat = getState().format.oneFormat;
    const response = await axiosApi.put('/formats/' + params.id, params.area);
    if (currentFormat && currentFormat._id === params.id) {
      dispatch(setFormat(response.data));
    }
  } catch (e) {
    if (isAxiosError(e) && e.response && e.response.status === 400) {
      return rejectWithValue(e.response.data as ValidationError);
    }
    throw e;
  }
});

export const createFormat = createAsyncThunk<void, FormatMutation, { rejectValue: ValidationError }>(
  'format/create_format',
  async (formatMutation, { rejectWithValue }) => {
    try {
      await axiosApi.post('/formats', formatMutation);
    } catch (e) {
      handleAxiosError(e, rejectWithValue);
    }
  },
);

export const removeFormat = createAsyncThunk<void, string, { rejectValue: GlobalError }>(
  'format/remove_format',
  async (id, { rejectWithValue }) => {
    try {
      await axiosApi.delete('/formats/' + id);
    } catch (e) {
      if (isAxiosError(e) && e.response && e.response.status === 404) {
        return rejectWithValue(e.response.data as GlobalError);
      }
      throw e;
    }
  },
);

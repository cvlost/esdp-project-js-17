import { createAsyncThunk } from '@reduxjs/toolkit';
import { GlobalError, LegalEntityList, LegalEntityMutation, ValidationError } from '../../../types';
import axiosApi from '../../../axios';
import { isAxiosError } from 'axios';
import { handleAxiosError } from '../../handleAxiosError';

export const fetchLegalEntity = createAsyncThunk<LegalEntityList[]>('legalEntity/fetch_legalEntities', async () => {
  const response = await axiosApi.get<LegalEntityList[]>('/legalEntities');
  return response.data;
});

export const fetchOneLegalEntity = createAsyncThunk<LegalEntityList, string>('legalEntity/fetch_one', async (id) => {
  const response = await axiosApi.get<LegalEntityList>(`/legalEntities/${id}`);
  return response.data;
});

export const createLegalEntity = createAsyncThunk<void, LegalEntityMutation, { rejectValue: ValidationError }>(
  'legalEntity/create_legalEntity',
  async (legalEntityMutation, { rejectWithValue }) => {
    try {
      await axiosApi.post('/legalEntities', legalEntityMutation);
    } catch (e) {
      handleAxiosError(e, rejectWithValue);
    }
  },
);

interface UpdateLegalEntityParams {
  id: string;
  legalEntity: LegalEntityMutation;
}

export const updateLegalEntity = createAsyncThunk<void, UpdateLegalEntityParams, { rejectValue: ValidationError }>(
  'legalEntity/edit_legalEntity',
  async (params, { rejectWithValue }) => {
    try {
      await axiosApi.put('legalEntities/' + params.id, params.legalEntity);
    } catch (e) {
      handleAxiosError(e, rejectWithValue);
    }
  },
);

export const removeLegalEntity = createAsyncThunk<void, string, { rejectValue: GlobalError }>(
  'legalEntity/remove_legalEntity',
  async (id, { rejectWithValue }) => {
    try {
      await axiosApi.delete('/legalEntities/' + id);
    } catch (e) {
      if (isAxiosError(e) && e.response && e.response.status === 404) {
        return rejectWithValue(e.response.data as GlobalError);
      }
      throw e;
    }
  },
);

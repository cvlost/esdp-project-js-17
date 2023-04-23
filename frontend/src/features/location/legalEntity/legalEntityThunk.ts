import { createAsyncThunk } from '@reduxjs/toolkit';
import { LegalEntityList, LegalEntityMutation, ValidationError } from '../../../types';
import axiosApi from '../../../axios';
import { isAxiosError } from 'axios';

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
      if (isAxiosError(e) && e.response && e.response.status === 400) {
        return rejectWithValue(e.response.data as ValidationError);
      }
      throw e;
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
      if (isAxiosError(e) && e.response && e.response.status === 400) {
        return rejectWithValue(e.response.data as ValidationError);
      }
      throw e;
    }
  },
);

export const removeLegalEntity = createAsyncThunk<void, string>('legalEntity/remove_legalEntity', async (id) => {
  await axiosApi.delete('/legalEntities/' + id);
});

import { isAxiosError } from 'axios';
import { ValidationError } from '../types';

export function handleAxiosError(e: any, rejectWithValue: any) {
  if (isAxiosError(e) && e.response) {
    if (e.response.status === 400 || e.response.status === 422) {
      return rejectWithValue(e.response.data as ValidationError);
    }
  }

  throw e;
}

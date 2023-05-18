import { createAsyncThunk } from '@reduxjs/toolkit';
import axiosApi from '../../axios';
import { CommercialLinkTypeMutation, Link } from '../../types';

export const createCommLink = createAsyncThunk<Link | null, CommercialLinkTypeMutation>(
  'commercialLink/createCommLink',
  async (arg) => {
    const response = await axiosApi.post<Link>('/links', arg);
    const jsn = response.data;

    if (!jsn) {
      throw new Error('not found');
    }

    return jsn;
  },
);

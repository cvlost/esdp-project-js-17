import { createAsyncThunk } from '@reduxjs/toolkit';
import axiosApi from '../../../axios';
import { DirectionType, DirectionTypeMutation } from '../../../types';

export const getDirectionsList = createAsyncThunk<DirectionType[]>('direction/fetchAll', async () => {
  const response = await axiosApi.get('/direction');
  return response.data;
});

export const deleteDirection = createAsyncThunk<void, string>('direction/delete', async (directionID) => {
  await axiosApi.delete('/direction/' + directionID);
});

export const createDirection = createAsyncThunk<void, DirectionTypeMutation>(
  'direction/create',
  async (directionData) => {
    try {
      const comment = await axiosApi.post('/direction', directionData);
      return comment.data;
    } catch (e) {
      throw new Error('No user');
    }
  },
);

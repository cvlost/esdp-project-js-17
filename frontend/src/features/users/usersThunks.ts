import { createAsyncThunk } from '@reduxjs/toolkit';
import axiosApi from '../../axios';
import { GlobalError, LoginMutation, User, UserResponse } from '../../types';
import { isAxiosError } from 'axios';
import { unsetUser } from './usersSlice';
import { RootState } from '../../app/store';

export const login = createAsyncThunk<User, LoginMutation, { rejectValue: GlobalError }>(
  'users/login',
  async (loginMutation, { rejectWithValue }) => {
    try {
      const response = await axiosApi.post<UserResponse>('/users/sessions', loginMutation);
      return response.data.user;
    } catch (e) {
      if (isAxiosError(e) && e.response && e.response.status === 400)
        return rejectWithValue(e.response.data as GlobalError);

      throw e;
    }
  },
);

export const logout = createAsyncThunk<void, void, { state: RootState }>('users/logout', async (_, { dispatch }) => {
  dispatch(unsetUser());
  await axiosApi.delete('/users/sessions');
});

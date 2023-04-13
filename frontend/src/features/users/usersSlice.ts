import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { GlobalError, User, UsersListResponse, ValidationError } from '../../types';
import { RootState } from '../../app/store';
import { getUsersList, login } from './usersThunks';

interface UsersState {
  user: User | null;
  usersListData: UsersListResponse;
  oneUser: User | null;
  getOneLoading: boolean;
  getAllLoading: boolean;
  loginError: GlobalError | null;
  registerError: ValidationError | null;
  loginLoading: boolean;
  registerLoading: boolean;
  deleteOneLoading: boolean;
  editOneLoading: boolean;
}

const initialState: UsersState = {
  user: null,
  usersListData: {
    users: [],
    page: 1,
    pages: 1,
    count: 0,
    perPage: 10,
  },
  oneUser: null,
  loginError: null,
  registerError: null,
  getOneLoading: false,
  getAllLoading: false,
  deleteOneLoading: false,
  editOneLoading: false,
  loginLoading: false,
  registerLoading: false,
};

const usersSlice = createSlice({
  name: 'users',
  initialState,
  reducers: {
    unsetUser: (state) => {
      state.user = null;
    },
    resetLoginError: (state) => {
      state.loginError = null;
    },
    setCurrentPage: (state, { payload: page }: PayloadAction<number>) => {
      state.usersListData.page = page;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(login.pending, (state) => {
      state.loginError = null;
      state.loginLoading = true;
    });
    builder.addCase(login.fulfilled, (state, { payload: user }) => {
      state.loginLoading = false;
      state.user = user;
    });
    builder.addCase(login.rejected, (state, { payload: error }) => {
      state.loginError = error || null;
      state.loginLoading = false;
    });

    builder.addCase(getUsersList.pending, (state) => {
      state.getAllLoading = true;
    });
    builder.addCase(getUsersList.fulfilled, (state, { payload }) => {
      state.usersListData = payload;
      state.getAllLoading = false;
    });
    builder.addCase(getUsersList.rejected, (state) => {
      state.getAllLoading = false;
    });
  },
});

export const usersReducer = usersSlice.reducer;
export const { unsetUser, resetLoginError, setCurrentPage } = usersSlice.actions;

export const selectUser = (state: RootState) => state.users.user;
export const selectLoginLoading = (state: RootState) => state.users.loginLoading;
export const selectLoginError = (state: RootState) => state.users.loginError;
export const selectOneUser = (state: RootState) => state.users.oneUser;
export const selectOneUserLoading = (state: RootState) => state.users.getOneLoading;
export const selectEditOneUserLoading = (state: RootState) => state.users.editOneLoading;
export const selectDeleteOneUserLoading = (state: RootState) => state.users.deleteOneLoading;
export const selectUsersListData = (state: RootState) => state.users.usersListData;
export const selectUsersListLoading = (state: RootState) => state.users.getAllLoading;
export const selectRegisterLoading = (state: RootState) => state.users.registerLoading;
export const selectRegisterError = (state: RootState) => state.users.registerError;

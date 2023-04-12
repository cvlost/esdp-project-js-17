import { createSlice } from '@reduxjs/toolkit';
import { GlobalError, User, ValidationError } from '../../types';
import { RootState } from '../../app/store';
import { createUser, login } from './usersThunks';

interface UsersState {
  user: User | null;
  usersList: User[];
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
  usersList: [],
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
    builder.addCase(createUser.pending, (state) => {
      state.registerLoading = true;
    });
    builder.addCase(createUser.fulfilled, (state) => {
      state.registerLoading = false;
    });
    builder.addCase(createUser.rejected, (state, { payload: error }) => {
      state.registerError = error || null;
      state.registerLoading = false;
    });
  },
});

export const usersReducer = usersSlice.reducer;
export const { unsetUser, resetLoginError } = usersSlice.actions;

export const selectUser = (state: RootState) => state.users.user;
export const selectLoginLoading = (state: RootState) => state.users.loginLoading;
export const selectLoginError = (state: RootState) => state.users.loginError;
export const selectOneUser = (state: RootState) => state.users.oneUser;
export const selectOneUserLoading = (state: RootState) => state.users.getOneLoading;
export const selectEditOneUserLoading = (state: RootState) => state.users.editOneLoading;
export const selectDeleteOneUserLoading = (state: RootState) => state.users.deleteOneLoading;
export const selectUsersList = (state: RootState) => state.users.usersList;
export const selectUsersListLoading = (state: RootState) => state.users.getAllLoading;
export const selectRegisterLoading = (state: RootState) => state.users.registerLoading;
export const selectRegisterError = (state: RootState) => state.users.registerError;

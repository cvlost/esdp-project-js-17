import React, { useEffect, useState } from 'react';
import { Box, Grid, Pagination, Typography } from '@mui/material';
import CardUser from '../../components/CardUser';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import {
  selectEditingError,
  selectEditOneUserLoading,
  selectOneEditingUser,
  selectUser,
  selectUsersListData,
  selectUsersListLoading,
  setCurrentPage,
} from './usersSlice';
import { deleteUser, getEditingUser, getUsersList, logout, updateUser } from './usersThunks';
import UserForm from '../../components/UserForm';
import { UserMutation } from '../../types';
import ModalBody from '../../components/ModalBody';

const UsersList = () => {
  const dispatch = useAppDispatch();
  const user = useAppSelector(selectUser);
  const usersListData = useAppSelector(selectUsersListData);
  const usersListLoading = useAppSelector(selectUsersListLoading);
  const editingUser = useAppSelector(selectOneEditingUser);
  const editLoading = useAppSelector(selectEditOneUserLoading);
  const error = useAppSelector(selectEditingError);
  const [userID, setUserID] = useState('');

  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const removeUser = async (userId: string) => {
    if (user?._id !== userId) {
      if (window.confirm('Do you really want to delete this user?')) {
        await dispatch(deleteUser(userId)).unwrap();
        dispatch(getUsersList({ page: usersListData.page, perPage: usersListData.perPage }));
      }
    } else {
      window.alert('U cant delete your own account');
    }
  };

  const openDialog = async (userId: string) => {
    await dispatch(getEditingUser(userId));
    setUserID(userId);
    setIsDialogOpen(true);
  };

  const onFormSubmit = async (userToChange: UserMutation) => {
    try {
      await dispatch(updateUser({ id: userID, user: userToChange })).unwrap();
      await dispatch(getUsersList({ page: usersListData.page, perPage: usersListData.perPage }));
      setIsDialogOpen(false);
      if (user && user._id === userID) {
        await dispatch(logout());
      }
    } catch (error) {
      throw new Error(`Произошла ошибка: ${error}`);
    }
  };

  useEffect(() => {
    dispatch(getUsersList({ page: usersListData.page, perPage: usersListData.perPage }));
  }, [dispatch, usersListData.page, usersListData.perPage]);

  return (
    <>
      <Box sx={{ py: 2 }}>
        <Typography variant="h5" component="h5">
          Список пользователей ({usersListData.count})
        </Typography>
        <Box>
          <Grid sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            {usersListData.users.map((user) => (
              <CardUser
                user={user}
                key={user._id}
                onDelete={() => removeUser(user._id)}
                onEditing={() => openDialog(user._id)}
              />
            ))}
          </Grid>
          <Pagination
            sx={{ display: 'flex', justifyContent: 'center' }}
            disabled={usersListLoading}
            count={usersListData.pages}
            page={usersListData.page}
            onChange={(event, page) => {
              dispatch(setCurrentPage(page));
            }}
          />
        </Box>
      </Box>
      {editingUser && (
        <ModalBody isOpen={isDialogOpen} onClose={() => setIsDialogOpen(false)}>
          <UserForm error={error} onSubmit={onFormSubmit} existingUser={editingUser} isEdit isLoading={editLoading} />
        </ModalBody>
      )}
    </>
  );
};

export default UsersList;

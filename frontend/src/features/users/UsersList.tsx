import React, { useEffect, useState } from 'react';
import {
  Box,
  Chip,
  Pagination,
  Paper,
  styled,
  Table,
  TableBody,
  TableCell,
  tableCellClasses,
  TableContainer,
  TableHead,
  TableRow,
} from '@mui/material';
import CardUser from './components/CardUser';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import {
  openSnackbar,
  selectEditingError,
  selectEditOneUserLoading,
  selectOneEditingUser,
  selectUser,
  selectUsersListData,
  selectUsersListLoading,
  setCurrentPage,
} from './usersSlice';
import { deleteUser, getEditingUser, getUsersList, updateUser } from './usersThunks';
import UserForm from './components/UserForm';
import { UserMutation } from '../../types';
import ModalBody from '../../components/ModalBody';
import SnackbarCard from '../../components/SnackbarCard/SnackbarCard';
import useConfirm from '../../components/Dialogs/Confirm/useConfirm';
import useAlert from '../../components/Dialogs/Alert/useAlert';
import { MainColorGreen } from '../../constants';

const UsersList = () => {
  const dispatch = useAppDispatch();
  const user = useAppSelector(selectUser);
  const usersListData = useAppSelector(selectUsersListData);
  const usersListLoading = useAppSelector(selectUsersListLoading);
  const editingUser = useAppSelector(selectOneEditingUser);
  const editLoading = useAppSelector(selectEditOneUserLoading);
  const error = useAppSelector(selectEditingError);
  const [userID, setUserID] = useState('');
  const { confirm } = useConfirm();
  const { alert } = useAlert();
  const StyledTableCell = styled(TableCell)(({ theme }) => ({
    [`&.${tableCellClasses.head}`]: {
      backgroundColor: MainColorGreen,
      color: theme.palette.common.white,
    },
  }));
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const removeUser = async (userId: string) => {
    if (user?._id !== userId) {
      if (await confirm('Предупреждение', 'Вы действительно хотите удалить пользователя')) {
        await dispatch(deleteUser(userId)).unwrap();
        await dispatch(getUsersList({ page: usersListData.page, perPage: usersListData.perPage })).unwrap();
        dispatch(openSnackbar({ status: true, parameter: 'remove' }));
      }
    } else {
      alert('Уведомление', 'Вы не можете удалить самого себя');
    }
  };

  const openDialog = async (userId: string) => {
    await dispatch(getEditingUser(userId));
    setUserID(userId);
    setIsDialogOpen(true);
  };

  const onFormSubmit = async (userToChange: UserMutation) => {
    if (await confirm('Уведомление', 'Вы действительно хотите отредактировать ?')) {
      try {
        await dispatch(updateUser({ id: userID, user: userToChange })).unwrap();
        await dispatch(getUsersList({ page: usersListData.page, perPage: usersListData.perPage }));
        dispatch(openSnackbar({ status: true, parameter: 'edit' }));
        setIsDialogOpen(false);
      } catch (error) {
        throw new Error(`Произошла ошибка: ${error}`);
      }
    } else {
      return;
    }
  };

  useEffect(() => {
    dispatch(getUsersList({ page: usersListData.page, perPage: usersListData.perPage }));
  }, [dispatch, usersListData.page, usersListData.perPage]);

  return (
    <>
      <Box sx={{ py: 2 }}>
        <Chip
          sx={{ mb: 2, fontSize: '20px', p: 3 }}
          label={'Список пользователей: ' + usersListData.count}
          variant="outlined"
          color="success"
        />

        <Box>
          <Paper elevation={3} sx={{ width: '100%', minHeight: '600px', overflowX: 'hidden' }}>
            <TableContainer>
              <Table sx={{ minWidth: 650 }} aria-label="simple table">
                <TableHead>
                  <TableRow>
                    <StyledTableCell align="center">Почта</StyledTableCell>
                    <StyledTableCell align="center">Имя</StyledTableCell>
                    <StyledTableCell align="center">Роль</StyledTableCell>
                    <StyledTableCell align="right">Управление</StyledTableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {usersListData.users.map((user) => (
                    <CardUser
                      key={user._id}
                      user={user}
                      onDelete={() => removeUser(user._id)}
                      onEditing={() => openDialog(user._id)}
                    />
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
          <Pagination
            size="small"
            sx={{ display: 'flex', justifyContent: 'center', mt: '20px' }}
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
      <SnackbarCard />
    </>
  );
};

export default UsersList;

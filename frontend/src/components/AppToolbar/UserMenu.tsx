import React, { useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { useNavigate } from 'react-router-dom';
import { User, UserMutation } from '../../types';
import { Button, Divider, Menu, MenuItem, Typography } from '@mui/material';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import LogoutIcon from '@mui/icons-material/Logout';
import GroupIcon from '@mui/icons-material/Groups';
import { getEditingUser, logout, updateUser } from '../../features/users/usersThunks';
import ModalBody from '../ModalBody';
import UserForm from '../UserForm';
import { selectEditingError, selectEditOneUserLoading, selectOneEditingUser } from '../../features/users/usersSlice';

interface Props {
  user: User;
}

const UserMenu: React.FC<Props> = ({ user }) => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const editingUser = useAppSelector(selectOneEditingUser);
  const editLoading = useAppSelector(selectEditOneUserLoading);
  const error = useAppSelector(selectEditingError);
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const openDialog = async () => {
    handleClose();
    await dispatch(getEditingUser(user._id));
    setIsDialogOpen(true);
  };

  const onFormSubmit = async (userToChange: UserMutation) => {
    try {
      await dispatch(updateUser({ id: user._id, user: userToChange })).unwrap();
      if (!error) {
        setIsDialogOpen(false);
      }
    } catch (error) {
      throw new Error(`Произошла ошибка: ${error}`);
    }
  };

  return (
    <>
      <Button onClick={handleClick} color="inherit" style={{ textTransform: 'inherit' }}>
        <Typography mr={1}>{user.displayName}</Typography>
        <AccountCircleIcon />
      </Button>
      <Menu anchorEl={anchorEl} keepMounted open={Boolean(anchorEl)} onClose={handleClose}>
        {user.role === 'admin' && [
          <MenuItem
            key="user-management"
            onClick={() => {
              handleClose();
              navigate('/users');
            }}
          >
            <GroupIcon sx={{ mr: 1 }} />
            Управление пользователями
          </MenuItem>,
          <Divider key="user-divider" />,
        ]}
        <MenuItem onClick={openDialog}>
          <GroupIcon sx={{ mr: 1 }} />
          Редактировать профиль
        </MenuItem>
        <MenuItem
          sx={{ justifyContent: 'center' }}
          onClick={() => {
            dispatch(logout());
            handleClose();
            navigate('/');
          }}
        >
          Выйти
          <LogoutIcon sx={{ ml: 1 }} />
        </MenuItem>
      </Menu>
      {editingUser && (
        <ModalBody isOpen={isDialogOpen} onClose={() => setIsDialogOpen(false)}>
          <UserForm error={error} onSubmit={onFormSubmit} existingUser={editingUser} isEdit isLoading={editLoading} />
        </ModalBody>
      )}
    </>
  );
};

export default UserMenu;

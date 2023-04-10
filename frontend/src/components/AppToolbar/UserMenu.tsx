import React, { useState } from 'react';
import { useAppDispatch } from '../../app/hooks';
import { useNavigate } from 'react-router-dom';
import { User } from '../../types';
import { Button, Divider, Menu, MenuItem, Typography } from '@mui/material';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import LogoutIcon from '@mui/icons-material/Logout';
import GroupIcon from '@mui/icons-material/Groups';
import { unsetUser } from '../../features/users/usersSlice';

interface Props {
  user: User;
}

const UserMenu: React.FC<Props> = ({ user }) => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <>
      <Button onClick={handleClick} color="inherit" style={{ textTransform: 'inherit' }}>
        <Typography mr={1}>{user.displayName}</Typography>
        <AccountCircleIcon />
      </Button>
      <Menu anchorEl={anchorEl} keepMounted open={Boolean(anchorEl)} onClose={handleClose}>
        <MenuItem
          onClick={() => {
            handleClose();
            navigate('/users');
          }}
        >
          <GroupIcon sx={{ mr: 1 }} />
          Управление пользователями
        </MenuItem>
        <Divider />
        <MenuItem
          sx={{ justifyContent: 'center' }}
          onClick={() => {
            dispatch(unsetUser());
            handleClose();
            navigate('/');
          }}
        >
          Выйти
          <LogoutIcon sx={{ ml: 1 }} />
        </MenuItem>
      </Menu>
    </>
  );
};

export default UserMenu;

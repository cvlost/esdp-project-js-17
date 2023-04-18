import React from 'react';
import { Alert, Snackbar } from '@mui/material';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { openSnackbar, selectSnackbarState } from '../../features/users/usersSlice';

const SnackbarCard = () => {
  const open = useAppSelector(selectSnackbarState);
  const dispatch = useAppDispatch();
  let txt = '';

  switch (open.parameter) {
    case 'remove':
      txt += 'Пользователь успешно удален';
      break;
    case 'edit':
      txt += 'Пользователь успешно отредактирован';
      break;
    case 'editProfile':
      txt += 'Ваш профиль успешно отредактирован';
      break;
  }

  return (
    <Snackbar
      open={open.status}
      autoHideDuration={6000}
      onClose={() => dispatch(openSnackbar({ status: false, parameter: '' }))}
    >
      <Alert
        onClose={() => dispatch(openSnackbar({ status: false, parameter: '' }))}
        severity="success"
        sx={{ width: '100%' }}
      >
        {txt}
      </Alert>
    </Snackbar>
  );
};

export default SnackbarCard;

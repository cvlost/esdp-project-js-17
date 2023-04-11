import React, { useEffect } from 'react';
import { Box, Grid, Typography } from '@mui/material';
import CardUser from '../../components/CardUser';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { selectUsersList } from './usersSlice';

const UsersList = () => {
  const dispatch = useAppDispatch();
  const usersList = useAppSelector(selectUsersList);
  useEffect(() => {}, [dispatch]);
  return (
    <Box sx={{ py: 2 }}>
      <Typography variant="h5" component="h5">
        Список пользователей
      </Typography>
      <Grid sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        {usersList.map((user) => (
          <CardUser user={user} key={user._id} />
        ))}
      </Grid>
    </Box>
  );
};

export default UsersList;

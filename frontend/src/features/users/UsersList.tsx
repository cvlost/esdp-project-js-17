import React from 'react';
import { Box, Grid, Typography } from '@mui/material';
import CardUser from '../../components/CardUser';
import { useAppSelector } from '../../app/hooks';
import { selectUsersList } from './usersSlice';

const UsersList = () => {
  const usersList = useAppSelector(selectUsersList);
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

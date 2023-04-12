import React, { useEffect } from 'react';
import { Box, Grid, Pagination, Typography } from '@mui/material';
import CardUser from '../../components/CardUser';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { selectUsersListData, selectUsersListLoading, setCurrentPage } from './usersSlice';
import { getUsersList } from './usersThunks';

const UsersList = () => {
  const dispatch = useAppDispatch();
  const usersListData = useAppSelector(selectUsersListData);
  const usersListLoading = useAppSelector(selectUsersListLoading);

  useEffect(() => {
    dispatch(getUsersList({ page: usersListData.page, perPage: usersListData.perPage }));
  }, [dispatch, usersListData.page, usersListData.perPage]);

  return (
    <Box sx={{ py: 2 }}>
      <Typography variant="h5" component="h5">
        Список пользователей ({usersListData.count})
      </Typography>
      <Box>
        <Grid sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          {usersListData.users.map((user) => (
            <CardUser user={user} key={user._id} />
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
  );
};

export default UsersList;

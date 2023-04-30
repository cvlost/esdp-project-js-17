import React from 'react';
import { AppBar, Grid, Toolbar, Typography } from '@mui/material';
import { StyledLink } from './StyledLink';
import { useAppSelector } from '../../app/hooks';
import { selectUser } from '../../features/users/usersSlice';
import UserMenu from './UserMenu';
import AnonymousMenu from './AnonymousMenu';

const AppToolbar = () => {
  const user = useAppSelector(selectUser);

  return (
    <AppBar position="static">
      <Toolbar>
        <Grid container sx={{ alignItems: 'center' }}>
          <Typography variant="h5" component="div" sx={{ flexGrow: 1, alignItems: 'center' }}>
            <StyledLink to="/">Шамдагай</StyledLink>
          </Typography>
          <Grid item>{user ? <UserMenu user={user} /> : <AnonymousMenu />}</Grid>
        </Grid>
      </Toolbar>
    </AppBar>
  );
};

export default AppToolbar;

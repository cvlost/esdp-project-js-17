import React, { PropsWithChildren, ReactNode } from 'react';
import AppToolbar from './AppToolbar/AppToolbar';
import { Box, Container, CssBaseline } from '@mui/material';
import { useAppSelector } from '../app/hooks';
import { selectIsUserLink } from '../features/location/locationsSlice';

interface Props extends PropsWithChildren {
  children: ReactNode;
}

const Layout: React.FC<Props> = ({ children }) => {
  const isUserLink = useAppSelector(selectIsUserLink);
  return (
    <>
      <CssBaseline />
      {!isUserLink && <AppToolbar />}
      <Box component="main">
        <Container maxWidth={false}>{children}</Container>
      </Box>
    </>
  );
};

export default Layout;

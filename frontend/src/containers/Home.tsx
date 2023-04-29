import React from 'react';
import HomeList from '../components/HomeComponents/HomeList';
import { Grid, Typography } from '@mui/material';
import Footer from '../components/HomeComponents/Footer';

const Home = () => {
  return (
    <>
      <Grid container alignItems="center">
        <Typography variant="h3">Все Баннеры</Typography>
      </Grid>
      <HomeList />
      <Footer />
    </>
  );
};

export default Home;

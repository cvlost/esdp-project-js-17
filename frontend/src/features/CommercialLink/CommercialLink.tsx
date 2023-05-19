import React from 'react';
import { Box, Typography, Container, Divider, Grid } from '@mui/material';
import 'swiper/css';
import 'swiper/css/navigation';
import CommercialLinkCard from './components/CommercialLinkCard';

const CommercialLink = () => {
  return (
    <Container>
      <Box sx={{ display: 'flex', alignItems: 'center' }}>
        <Typography sx={{ my: 2, mr: 1 }} component="h1" variant="h4">
          Список баннеров
          <Divider light sx={{ mt: 1, background: '#ff6300' }} />
        </Typography>
      </Box>
      <Grid container spacing={{ xs: 2, md: 3 }} columns={{ xs: 4, sm: 8, md: 12 }}>
        <CommercialLinkCard />
      </Grid>
    </Container>
  );
};

export default CommercialLink;

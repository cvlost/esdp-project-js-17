import React from 'react';
import { Avatar, Box, Typography } from '@mui/material';
import GpsFixedIcon from '@mui/icons-material/GpsFixed';

const CommercialLink = () => {
  return (
    <Box
      sx={{
        mt: 6,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
      }}
    >
      <Avatar sx={{ m: 1 }}>
        <GpsFixedIcon color="success" />
      </Avatar>
      <Typography component="h1" variant="h5">
        Конструктор предложения
      </Typography>
    </Box>
  );
};

export default CommercialLink;

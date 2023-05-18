import React from 'react';
import { Avatar, Box, Typography } from '@mui/material';
import ConstructionIcon from '@mui/icons-material/Construction';

const ConstructorLink = () => {
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
        <ConstructionIcon color="success" />
      </Avatar>
      <Typography component="h1" variant="h5">
        Конструктор предложения
      </Typography>
    </Box>
  );
};

export default ConstructorLink;

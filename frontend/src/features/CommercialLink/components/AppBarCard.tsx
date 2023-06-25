import React from 'react';
import { AppBar, Box, Toolbar, Typography, useMediaQuery } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const AppBarCard = () => {
  const navigate = useNavigate();
  const matches_400 = useMediaQuery('(min-width:400px)');
  return (
    <AppBar position="static">
      <Toolbar>
        {matches_400 && (
          <Box onClick={() => navigate(-1)} component="p" sx={{ flexGrow: 1, cursor: 'pointer' }}>
            Шамдагай
          </Box>
        )}
        <Typography component="p">+996 (312) 61-18-40</Typography>
      </Toolbar>
    </AppBar>
  );
};

export default AppBarCard;

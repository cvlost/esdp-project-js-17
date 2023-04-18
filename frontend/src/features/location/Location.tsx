import React from 'react';
import { Box, Button, Grid } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import ShareLocationIcon from '@mui/icons-material/ShareLocation';
import AddIcon from '@mui/icons-material/Add';

const Location = () => {
  const navigate = useNavigate();

  return (
    <Box sx={{ py: 2 }}>
      <Grid container spacing={1}>
        <Grid item>
          <Button
            variant="contained"
            onClick={() => {
              navigate('/location');
            }}
          >
            <ShareLocationIcon sx={{ mr: 1 }} />
            Список локаций
          </Button>
        </Grid>
        <Grid item>
          <Button
            variant="contained"
            onClick={() => {
              navigate('/location/create_location');
            }}
          >
            <AddIcon sx={{ mr: 1 }} />
            Создать локацию
          </Button>
        </Grid>
      </Grid>
      <Box>Список локаций</Box>
    </Box>
  );
};

export default Location;

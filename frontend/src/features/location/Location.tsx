import React from 'react';
import { Box, Button, Grid } from '@mui/material';
import { useNavigate, useOutlet } from 'react-router-dom';
import ShareLocationIcon from '@mui/icons-material/ShareLocation';
import AddIcon from '@mui/icons-material/Add';
import LocationList from './LocationList';
import SouthAmericaIcon from '@mui/icons-material/SouthAmerica';

const Location = () => {
  const navigate = useNavigate();
  const outlet = useOutlet();

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
        <Grid item>
          <Button
            variant="contained"
            onClick={() => {
              navigate('/location/create_region');
            }}
          >
            <SouthAmericaIcon sx={{ mr: 1 }} />
            Создать регион
          </Button>
        </Grid>
        <Grid item>
          <Button
            variant="contained"
            onClick={() => {
              navigate('/location/create_direction');
            }}
          >
            <SouthAmericaIcon sx={{ mr: 1 }} />
            Создать направление
          </Button>
        </Grid>
      </Grid>
      <Box>{!outlet ? <LocationList /> : outlet}</Box>
    </Box>
  );
};

export default Location;

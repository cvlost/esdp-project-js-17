import React from 'react';
import { Box, Button, Grid } from '@mui/material';
import { useNavigate, useOutlet } from 'react-router-dom';
import ShareLocationIcon from '@mui/icons-material/ShareLocation';
import AddIcon from '@mui/icons-material/Add';
import LocationList from './LocationList';
import SouthAmericaIcon from '@mui/icons-material/SouthAmerica';
import GpsFixedIcon from '@mui/icons-material/GpsFixed';
import { useAppSelector } from '../../app/hooks';
import { selectUser } from '../users/usersSlice';
import DashboardIcon from '@mui/icons-material/Dashboard';
import DomainAddIcon from '@mui/icons-material/DomainAdd';

const Location = () => {
  const user = useAppSelector(selectUser);
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
        {user?.role === 'admin' ? (
          <>
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
                <GpsFixedIcon sx={{ mr: 1 }} />
                Создать направление
              </Button>
            </Grid>
            <Grid item>
              <Button
                variant="contained"
                onClick={() => {
                  navigate('/location/create_format');
                }}
              >
                <DashboardIcon sx={{ mr: 1 }} />
                Создать формат
              </Button>
            </Grid>
            <Grid item>
              <Button
                variant="contained"
                onClick={() => {
                  navigate('/location/create_area');
                }}
              >
                <SouthAmericaIcon sx={{ mr: 1 }} />
                Создать область
              </Button>
            </Grid>
            <Grid item>
              <Button
                variant="contained"
                onClick={() => {
                  navigate('/location/create_legal_entity');
                }}
              >
                <DomainAddIcon sx={{ mr: 1 }} />
                Создать Юр. лицо
              </Button>
            </Grid>
          </>
        ) : null}
      </Grid>
      <Box>{!outlet ? <LocationList /> : outlet}</Box>
    </Box>
  );
};

export default Location;

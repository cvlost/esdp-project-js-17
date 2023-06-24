import React from 'react';
import { Autocomplete, Box, Button, CircularProgress, Grid, TextField } from '@mui/material';
import { useNavigate, useOutlet } from 'react-router-dom';
import ShareLocationIcon from '@mui/icons-material/ShareLocation';
import LocationList from './LocationList';
import { useAppSelector } from '../../app/hooks';
import { selectUser } from '../users/usersSlice';
import ExportToExcel from '../exportToExcel/ExportToExcel';
import { selectLocationsListData } from './locationsSlice';
import InsertLinkIcon from '@mui/icons-material/InsertLink';

interface LinkOption {
  label: string;
  link: string;
}

const link_options: LinkOption[] = [
  { label: 'Создать Локацию', link: '/create_location' },
  { label: 'Создать Область', link: '/create_area' },
  { label: 'Создать Район', link: '/create_region' },
  { label: 'Создать Город', link: '/create_city' },
  { label: 'Создать Сторону', link: '/create_direction' },
  { label: 'Создать Размер', link: '/create_size' },
  { label: 'Создать Формат', link: '/create_format' },
  { label: 'Создать Юр.лицо', link: '/create_legal_entity' },
  { label: 'Создать Улицу', link: '/create_street' },
  { label: 'Создать Освещение', link: '/create_lighting' },
  { label: 'Создать Клиента', link: '/create_client' },
];

const Location = () => {
  const user = useAppSelector(selectUser);
  const locationsList = useAppSelector(selectLocationsListData).locations;
  const navigate = useNavigate();
  const outlet = useOutlet();

  return (
    <Box sx={{ py: 2 }}>
      <Grid container spacing={1} alignItems="center">
        <Grid item>
          <Button
            color="success"
            variant="contained"
            onClick={() => {
              navigate('/');
            }}
          >
            <ShareLocationIcon sx={{ mr: 1 }} />
            Список локаций
          </Button>
        </Grid>
        <Grid item>
          <Button
            color="success"
            variant="contained"
            onClick={() => {
              navigate('/list_link');
            }}
          >
            <InsertLinkIcon sx={{ mr: 1 }} />
            Список ссылок
          </Button>
        </Grid>
        {locationsList.length !== 0 ? (
          <Grid item>
            <ExportToExcel data={locationsList ? locationsList : []} />
          </Grid>
        ) : (
          <CircularProgress color="success" sx={{ ml: 1 }} />
        )}
        {user?.role === 'admin' ? (
          <>
            <Grid item>
              <Autocomplete
                onChange={(event, newValue: LinkOption | null) => {
                  if (newValue?.link !== undefined) {
                    navigate(newValue.link);
                  }
                }}
                options={link_options}
                noOptionsText={'Нет совпадений'}
                sx={{ width: 250, my: 1 }}
                renderInput={(params) => <TextField {...params} label="Создание" />}
              />
            </Grid>
          </>
        ) : null}
      </Grid>
      <Box>{!outlet ? <LocationList /> : outlet}</Box>
    </Box>
  );
};

export default Location;

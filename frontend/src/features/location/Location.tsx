import React from 'react';
import { Autocomplete, Box, Button, Grid, TextField } from '@mui/material';
import { useNavigate, useOutlet } from 'react-router-dom';
import ShareLocationIcon from '@mui/icons-material/ShareLocation';
import LocationList from './LocationList';
import { useAppSelector } from '../../app/hooks';
import { selectUser } from '../users/usersSlice';

interface LinkOption {
  label: string;
  link: string;
}

const link_options: LinkOption[] = [
  { label: 'Создать Локацию', link: '/create_location' },
  { label: 'Создать Область', link: '/create_area' },
  { label: 'Создать Район', link: '/create_region' },
  { label: 'Создать Город', link: '/create_city' },
  { label: 'Создать Направление', link: '/create_direction' },
  { label: 'Создать Формат', link: '/create_format' },
  { label: 'Создать Юр.лицо', link: '/create_legal_entity' },
  { label: 'Создать Улицу', link: '/create_street' },
  { label: 'Создать Освещение', link: '/create_lighting' },
];

const Location = () => {
  const user = useAppSelector(selectUser);
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
                sx={{ width: 250 }}
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

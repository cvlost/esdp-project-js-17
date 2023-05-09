import React, { useState } from 'react';
import { Avatar, Box, Button, CircularProgress, Grid, TextField, Typography } from '@mui/material';
import SouthAmericaIcon from '@mui/icons-material/SouthAmerica';
import { RegionMutation } from '../../../../types';
import { useAppSelector } from '../../../../app/hooks';
import { selectCreateRegionLoading, selectRegionError } from '../regionSlice';

interface Props {
  onSubmit: (region: RegionMutation) => void;
}

const FormCreateRegion: React.FC<Props> = ({ onSubmit }) => {
  const createLoading = useAppSelector(selectCreateRegionLoading);
  const error = useAppSelector(selectRegionError);
  const [value, setValue] = useState('');

  const onFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({ name: value });
    setValue('');
  };

  const getFieldError = (fieldName: string) => {
    try {
      return error?.errors[fieldName].message;
    } catch {
      return undefined;
    }
  };
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
        <SouthAmericaIcon color="success" />
      </Avatar>
      <Typography component="h1" variant="h5">
        Создать район
      </Typography>
      <Box component="form" sx={{ mt: 3, width: '100%' }} onSubmit={onFormSubmit}>
        <Grid container sx={{ flexDirection: 'column' }} spacing={2}>
          <Grid item xs={12}>
            <TextField
              value={value}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setValue(e.target.value)}
              required
              fullWidth
              label="Название региона"
              type="text"
              name="name"
              autoComplete="off"
              error={Boolean(getFieldError('name'))}
              helperText={getFieldError('name')}
            />
          </Grid>
        </Grid>
        <Button
          disabled={createLoading}
          color="success"
          type="submit"
          fullWidth
          variant="contained"
          sx={{ mt: 3, mb: 2 }}
        >
          {!createLoading ? 'Создать регион' : <CircularProgress />}
        </Button>
      </Box>
    </Box>
  );
};

export default FormCreateRegion;

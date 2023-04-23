import React, { useState } from 'react';
import { Avatar, Box, Button, CircularProgress, Grid, TextField, Typography } from '@mui/material';
import { StreetMutation } from '../../../../types';
import { useAppSelector } from '../../../../app/hooks';
import { selectCreateStreetLoading, selectStreetError } from '../streetSlice';
import SignpostIcon from '@mui/icons-material/Signpost';

interface Props {
  onSubmit: (street: StreetMutation) => void;
}

const FormCreateStreet: React.FC<Props> = ({ onSubmit }) => {
  const createLoading = useAppSelector(selectCreateStreetLoading);
  const error = useAppSelector(selectStreetError);
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
      <Avatar sx={{ m: 1, bgcolor: '#1976d2' }}>
        <SignpostIcon />
      </Avatar>
      <Typography component="h1" variant="h5">
        Создать улицу
      </Typography>
      <Box component="form" sx={{ mt: 3, width: '100%' }} onSubmit={onFormSubmit}>
        <Grid container sx={{ flexDirection: 'column' }} spacing={2}>
          <Grid item xs={12}>
            <TextField
              value={value}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setValue(e.target.value)}
              required
              fullWidth
              label="Название улицы"
              type="text"
              name="name"
              autoComplete="off"
              error={Boolean(getFieldError('name'))}
              helperText={getFieldError('name')}
            />
          </Grid>
        </Grid>
        <Button disabled={createLoading} type="submit" fullWidth variant="contained" sx={{ mt: 3, mb: 2 }}>
          {!createLoading ? 'Создать улицу' : <CircularProgress />}
        </Button>
      </Box>
    </Box>
  );
};

export default FormCreateStreet;

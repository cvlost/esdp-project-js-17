import React, { useState } from 'react';
import { Avatar, Box, Button, CircularProgress, Grid, TextField, Typography } from '@mui/material';
import GpsFixedIcon from '@mui/icons-material/GpsFixed';
import { DirectionMutation, ValidationError } from '../../../../types';

interface Props {
  onSubmit: (direction: DirectionMutation) => void;
  existingDir?: DirectionMutation;
  isEdit?: boolean;
  Loading: boolean;
  error: ValidationError | null;
}

const initialState: DirectionMutation = {
  name: '',
};

const FormCreateDirection: React.FC<Props> = ({ onSubmit, existingDir = initialState, Loading, isEdit, error }) => {
  const [value, setValue] = useState<DirectionMutation>(existingDir);

  const onFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(value);
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
        <GpsFixedIcon color="success" />
      </Avatar>
      <Typography component="h1" variant="h5">
        {Loading ? <CircularProgress /> : isEdit ? 'Редактировать направление' : 'Создать направление'}
      </Typography>
      <Box component="form" sx={{ mt: 3, width: '100%' }} onSubmit={onFormSubmit}>
        <Grid container sx={{ flexDirection: 'column' }} spacing={2}>
          <Grid item xs={12}>
            <TextField
              value={value.name}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setValue({ name: e.target.value })}
              required
              fullWidth
              label="Направление"
              type="text"
              name="name"
              autoComplete="off"
              error={Boolean(getFieldError('name'))}
              helperText={getFieldError('name')}
            />
          </Grid>
        </Grid>
        <Button disabled={Loading} type="submit" fullWidth variant="contained" color="success" sx={{ mt: 3, mb: 2 }}>
          {Loading ? <CircularProgress /> : isEdit ? 'Редактировать направление' : 'Создать'}
        </Button>
      </Box>
    </Box>
  );
};

export default FormCreateDirection;

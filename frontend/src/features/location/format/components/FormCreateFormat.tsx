import React, { useState } from 'react';
import { Avatar, Box, Button, CircularProgress, Grid, TextField, Typography } from '@mui/material';
import DashboardIcon from '@mui/icons-material/Dashboard';
import { FormatMutation, ValidationError } from '../../../../types';

interface Props {
  onSubmit: (format: FormatMutation) => void;
  existingFormat?: FormatMutation;
  isEdit?: boolean;
  Loading: boolean;
  error: ValidationError | null;
}

const initialState: FormatMutation = {
  name: '',
};

const FormCreateFormat: React.FC<Props> = ({ onSubmit, existingFormat = initialState, isEdit, Loading, error }) => {
  const [value, setValue] = useState<FormatMutation>(existingFormat);

  const onFormSubmit = async (e: React.FormEvent) => {
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
        <DashboardIcon color="success" />
      </Avatar>
      <Typography component="h1" variant="h5">
        {Loading ? <CircularProgress color="success" /> : isEdit ? 'Редактировать Формат' : 'Создать Формат'}
      </Typography>
      <Box component="form" sx={{ mt: 3, width: '100%' }} onSubmit={onFormSubmit}>
        <Grid container sx={{ flexDirection: 'column' }} spacing={2}>
          <Grid item xs={12}>
            <TextField
              value={value.name}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setValue({ name: e.target.value })}
              color="success"
              required
              fullWidth
              label="Название формата"
              type="text"
              name="name"
              autoComplete="off"
              error={Boolean(getFieldError('name'))}
              helperText={getFieldError('name')}
            />
          </Grid>
        </Grid>
        <Button disabled={Loading} type="submit" fullWidth variant="contained" color="success" sx={{ mt: 3, mb: 2 }}>
          {Loading ? <CircularProgress color="success" /> : isEdit ? 'Редактировать Формат' : 'Создать'}
        </Button>
      </Box>
    </Box>
  );
};

export default FormCreateFormat;

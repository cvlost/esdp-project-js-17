import React, { useState } from 'react';
import { Avatar, Box, Button, CircularProgress, Grid, TextField, Typography } from '@mui/material';
import LightModeOutlinedIcon from '@mui/icons-material/LightModeOutlined';
import { LightingMutation, ValidationError } from '../../../../types';

interface Props {
  onSubmit: (lighting: LightingMutation) => void;
  existingLight?: LightingMutation;
  isEdit?: boolean;
  Loading: boolean;
  error: ValidationError | null;
}
const initialState: LightingMutation = {
  name: '',
};

const FormCreateLighting: React.FC<Props> = ({ onSubmit, existingLight = initialState, error, isEdit, Loading }) => {
  const [value, setValue] = useState<LightingMutation>(existingLight);

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
        <LightModeOutlinedIcon color="success" />
      </Avatar>
      <Typography component="h1" variant="h5">
        {Loading ? <CircularProgress /> : isEdit ? 'Редактировать освещение' : 'Создать тип освещения'}
      </Typography>
      <Box component="form" sx={{ mt: 3, width: '100%' }} onSubmit={onFormSubmit}>
        <Grid container sx={{ flexDirection: 'column' }} spacing={2}>
          <Grid item xs={12}>
            <TextField
              value={value.name}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setValue({ name: e.target.value })}
              required
              fullWidth
              label="Освещение"
              type="text"
              name="name"
              autoComplete="off"
              error={Boolean(getFieldError('name'))}
              helperText={getFieldError('name')}
            />
          </Grid>
        </Grid>
        <Button disabled={Loading} type="submit" fullWidth variant="contained" color="success" sx={{ mt: 3, mb: 2 }}>
          {Loading ? <CircularProgress /> : isEdit ? 'Редактировать освещение' : 'Создать'}
        </Button>
      </Box>
    </Box>
  );
};

export default FormCreateLighting;

import React, { useState } from 'react';
import { Avatar, Box, Button, CircularProgress, Grid, TextField, Typography } from '@mui/material';
import SouthAmericaOutlinedIcon from '@mui/icons-material/SouthAmericaOutlined';
import { AreaMutation, ValidationError } from '../../../../types';

interface Props {
  onSubmit: (area: AreaMutation) => void;
  existingArea?: AreaMutation;
  isEdit?: boolean;
  Loading: boolean;
  error: ValidationError | null;
}

const initialState: AreaMutation = {
  name: '',
};

const FormCreateArea: React.FC<Props> = ({ onSubmit, existingArea = initialState, isEdit, Loading, error }) => {
  const [state, setState] = useState<AreaMutation>(existingArea);

  const onFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(state);
  };

  const onChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setState((prev) => ({ ...prev, [name]: value }));
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
        <SouthAmericaOutlinedIcon color="success" />
      </Avatar>
      <Typography component="h1" variant="h5">
        {Loading ? <CircularProgress color="success" /> : isEdit ? 'Редактировать область' : 'Создать область'}
      </Typography>
      <Box component="form" sx={{ mt: 3, width: '100%' }} onSubmit={onFormSubmit}>
        <Grid container sx={{ flexDirection: 'column' }} spacing={2}>
          <Grid item xs={12}>
            <TextField
              required
              fullWidth
              label="Область"
              type="text"
              name="name"
              autoComplete="off"
              color="success"
              value={state.name}
              onChange={onChange}
              error={Boolean(getFieldError('name'))}
              helperText={getFieldError('name')}
            />
          </Grid>
        </Grid>
        <Button disabled={Loading} type="submit" fullWidth variant="contained" color="success" sx={{ mt: 3, mb: 2 }}>
          {Loading ? <CircularProgress color="success" /> : isEdit ? 'Редактировать' : 'Создать'}
        </Button>
      </Box>
    </Box>
  );
};

export default FormCreateArea;

import React, { useState } from 'react';
import { ClientMutation, ValidationError } from '../../../../types';
import { Avatar, Box, Button, CircularProgress, Grid, TextField, Typography } from '@mui/material';
import FolderSharedIcon from '@mui/icons-material/FolderShared';
interface Props {
  onSubmit: (client: ClientMutation) => void;
  existingClient?: ClientMutation;
  isEdit?: boolean;
  Loading: boolean;
  error: ValidationError | null;
}

const initialState: ClientMutation = {
  email: '',
  name: '',
  phone: '',
};

const FormCreateClient: React.FC<Props> = ({ onSubmit, existingClient = initialState, isEdit, Loading, error }) => {
  const [state, setState] = useState<ClientMutation>(existingClient);

  const onFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(state);
    setState({ name: '', phone: '', email: '' });
  };

  const inputChangeHandler = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setState((prevState) => {
      return { ...prevState, [name]: value };
    });
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
        <FolderSharedIcon color="success" />
      </Avatar>
      <Typography component="h1" variant="h5">
        {Loading ? <CircularProgress /> : isEdit ? 'Редактировать клиента' : 'Создать клиента'}
      </Typography>
      <Box component="form" sx={{ mt: 3, width: '100%' }} onSubmit={onFormSubmit}>
        <Grid container sx={{ flexDirection: 'column' }} spacing={2}>
          <Grid item xs={12}>
            <TextField
              value={state.name}
              onChange={inputChangeHandler}
              required
              fullWidth
              label="Имя клиента"
              type="text"
              name="name"
              autoComplete="off"
              error={Boolean(getFieldError('name'))}
              helperText={getFieldError('name')}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              value={state.phone}
              onChange={inputChangeHandler}
              fullWidth
              label="Номер клиента"
              type="number"
              name="phone"
              autoComplete="off"
              error={Boolean(getFieldError('phone'))}
              helperText={getFieldError('phone')}
            ></TextField>
          </Grid>
          <Grid item xs={12}>
            <TextField
              value={state.email}
              onChange={inputChangeHandler}
              fullWidth
              label="Email клиента"
              type="email"
              name="email"
              autoComplete="off"
              error={Boolean(getFieldError('email'))}
              helperText={getFieldError('email')}
            />
          </Grid>
        </Grid>
        <Button disabled={Loading} type="submit" fullWidth variant="contained" color="success" sx={{ mt: 3, mb: 2 }}>
          {Loading ? <CircularProgress /> : isEdit ? 'Редактировать' : 'Создать'}
        </Button>
      </Box>
    </Box>
  );
};

export default FormCreateClient;

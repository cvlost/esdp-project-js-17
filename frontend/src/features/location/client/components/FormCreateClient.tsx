import React, { useState } from 'react';
import { useAppSelector } from '../../../../app/hooks';
import { selectCreateClientLoading, selectClientError } from '../clientSlice';
import { ClientMutation } from '../../../../types';
import { Avatar, Box, Button, CircularProgress, Grid, TextField, Typography } from '@mui/material';
import FolderSharedIcon from '@mui/icons-material/FolderShared';
interface Props {
  onSubmit: (client: ClientMutation) => void;
}

const FormCreateClient: React.FC<Props> = ({ onSubmit }) => {
  const [state, setState] = useState<ClientMutation>({ name: '', phone: '', email: '' });
  const createLoading = useAppSelector(selectCreateClientLoading);
  const error = useAppSelector(selectClientError);

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
        Создать клиента
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
              required
              fullWidth
              label="Номер клиента"
              type="number"
              name="phone"
              autoComplete="off"
              error={Boolean(getFieldError('phone'))}
              helperText={getFieldError('phone')}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              value={state.phone}
              onChange={inputChangeHandler}
              required
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
        <Button
          disabled={createLoading}
          type="submit"
          fullWidth
          variant="contained"
          color="success"
          sx={{ mt: 3, mb: 2 }}
        >
          {!createLoading ? 'Создать клиента' : <CircularProgress />}
        </Button>
      </Box>
    </Box>
  );
};

export default FormCreateClient;

import React, { useState } from 'react';
import { Alert, Avatar, Box, Button, Container, Grid, MenuItem, TextField, Typography } from '@mui/material';
import LockOpenIcon from '@mui/icons-material/LockOpen';
import { useNavigate } from 'react-router-dom';
import { RegisterMutation } from '../../types';
import { ROLES } from '../../constants';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { createUser } from './usersThunks';
import { selectRegisterError, selectRegisterLoading } from './usersSlice';

const CreateUser = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const creating = useAppSelector(selectRegisterLoading);
  const error = useAppSelector(selectRegisterError);
  const [state, setState] = useState<RegisterMutation>({
    email: '',
    password: '',
    role: '',
    displayName: '',
  });

  const inputChangeHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setState((prevState) => ({ ...prevState, [name]: value }));
  };

  const submitFormHandler = async (event: React.FormEvent) => {
    event.preventDefault();
    await dispatch(createUser(state)).unwrap();
    navigate('/users');
  };

  return (
    <Container component="main" maxWidth="xs">
      <Box
        sx={{
          mt: 6,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
          <LockOpenIcon />
        </Avatar>
        <Typography component="h1" variant="h5">
          Регистрация
        </Typography>
        {error && (
          <Alert severity="error" sx={{ mt: 3, width: '100%' }}>
            {error.message}
          </Alert>
        )}
        <Box component="form" onSubmit={submitFormHandler} sx={{ mt: 3, width: '100%' }}>
          <Grid container sx={{ flexDirection: 'column' }} spacing={2}>
            <Grid item xs={12}>
              <TextField
                required
                fullWidth
                label="Email пользователя"
                type="email"
                name="email"
                autoComplete="off"
                value={state.email}
                onChange={inputChangeHandler}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                required
                fullWidth
                label="Имя пользователя"
                name="displayName"
                autoComplete="off"
                value={state.displayName}
                onChange={inputChangeHandler}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                select
                required
                fullWidth
                label="Роль пользователя"
                name="role"
                value={state.role}
                onChange={inputChangeHandler}
              >
                <MenuItem value="" disabled>
                  Выбрать роль
                </MenuItem>
                {ROLES.map((role) => (
                  <MenuItem key={role.name} value={role.name}>
                    {role.prettyName}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid item xs={12}>
              <TextField
                required
                fullWidth
                label="Пароль пользователя"
                name="password"
                type="password"
                autoComplete="off"
                value={state.password}
                onChange={inputChangeHandler}
              />
            </Grid>
          </Grid>
          <Button
            disabled={
              state.email === '' || state.displayName === '' || state.password === '' || state.role === '' || creating
            }
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
          >
            Регистрировать
          </Button>
        </Box>
      </Box>
    </Container>
  );
};

export default CreateUser;

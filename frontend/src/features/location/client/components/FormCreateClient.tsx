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
  companyName: '',
  companyKindOfActivity: '',
  companyAddress: '',
  companyPhone: '',
  companyEmail: '',
  companySite: '',
  companyBirthday: '',
  CompanyManagementName: '',
  CompanyManagementJobTitle: '',
  CompanyManagementBirthday: '',
  contactPersonName: '',
  contactPersonJobTitle: '',
  contactPersonBirthday: '',
  advertisingChannel: '',
};

const FormCreateClient: React.FC<Props> = ({ onSubmit, existingClient = initialState, isEdit, Loading, error }) => {
  const [state, setState] = useState<ClientMutation>(existingClient);

  const onFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(state);
    setState({
      companyName: '',
      companyKindOfActivity: '',
      companyAddress: '',
      companyPhone: '',
      companyEmail: '',
      companySite: '',
      companyBirthday: '',
      CompanyManagementName: '',
      CompanyManagementJobTitle: '',
      CompanyManagementBirthday: '',
      contactPersonName: '',
      contactPersonJobTitle: '',
      contactPersonBirthday: '',
      advertisingChannel: '',
    });
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
          <Typography component="h1" variant="h5" sx={{ mt: 2 }}>
            Организация
          </Typography>
          <Grid item xs={12}>
            <TextField
              value={state.companyName}
              onChange={inputChangeHandler}
              required
              fullWidth
              label="Имя организации"
              type="text"
              name="companyName"
              autoComplete="off"
              error={Boolean(getFieldError('name'))}
              helperText={getFieldError('name')}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              value={state.companyPhone}
              onChange={inputChangeHandler}
              fullWidth
              label="Номер организации"
              type="number"
              name="companyPhone"
              autoComplete="off"
              error={Boolean(getFieldError('companyPhone'))}
              helperText={getFieldError('companyPhone')}
            ></TextField>
          </Grid>
          <Grid item xs={12}>
            <TextField
              value={state.companyEmail}
              onChange={inputChangeHandler}
              fullWidth
              label="Email организации"
              type="email"
              name="companyEmail"
              autoComplete="off"
              error={Boolean(getFieldError('companyEmail'))}
              helperText={getFieldError('companyEmail')}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              value={state.companyKindOfActivity}
              onChange={inputChangeHandler}
              fullWidth
              label="Вид деятельности организации"
              type="text"
              name="companyKindOfActivity"
              autoComplete="off"
              error={Boolean(getFieldError('companyKindOfActivity'))}
              helperText={getFieldError('companyKindOfActivity')}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              value={state.companyAddress}
              onChange={inputChangeHandler}
              fullWidth
              label="Адрес организации"
              type="text"
              name="companyAddress"
              autoComplete="off"
              error={Boolean(getFieldError('companyAddress'))}
              helperText={getFieldError('companyAddress')}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              value={state.companySite}
              onChange={inputChangeHandler}
              fullWidth
              label="Сайт организации"
              type="url"
              name="companySite"
              autoComplete="off"
              error={Boolean(getFieldError('companySite'))}
              helperText={getFieldError('companySite')}
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

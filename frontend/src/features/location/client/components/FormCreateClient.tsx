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
        {Loading ? <CircularProgress color="success" /> : isEdit ? 'Редактировать клиента' : 'Создать клиента'}
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
              color="success"
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
              color="success"
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
              color="success"
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
              color="success"
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
              color="success"
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
              color="success"
              fullWidth
              label="Сайт организации"
              type="url"
              name="companySite"
              autoComplete="off"
              error={Boolean(getFieldError('companySite'))}
              helperText={getFieldError('companySite')}
            />
          </Grid>
          <Grid item xs={12}>
            <Typography variant="subtitle1" sx={{ m: 0 }}>
              День рождение организации
            </Typography>
            <TextField
              value={state.companyBirthday}
              onChange={inputChangeHandler}
              color="success"
              fullWidth
              type="date"
              name="companyBirthday"
              autoComplete="off"
              error={Boolean(getFieldError('companyBirthday'))}
              helperText={getFieldError('companyBirthday')}
            />
          </Grid>
          <Typography component="h1" variant="h5" sx={{ mt: 1 }}>
            Руководство компании
          </Typography>
          <Grid item xs={12}>
            <TextField
              value={state.CompanyManagementName}
              onChange={inputChangeHandler}
              color="success"
              fullWidth
              label="ФИО"
              type="text"
              name="CompanyManagementName"
              autoComplete="off"
              error={Boolean(getFieldError('CompanyManagementName'))}
              helperText={getFieldError('CompanyManagementName')}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              value={state.CompanyManagementJobTitle}
              onChange={inputChangeHandler}
              color="success"
              fullWidth
              label="должность"
              type="text"
              name="CompanyManagementJobTitle"
              autoComplete="off"
              error={Boolean(getFieldError('CompanyManagementJobTitle'))}
              helperText={getFieldError('CompanyManagementJobTitle')}
            />
          </Grid>
          <Grid item xs={12}>
            <Typography variant="subtitle1" sx={{ m: 0 }}>
              День рождение
            </Typography>
            <TextField
              value={state.CompanyManagementBirthday}
              onChange={inputChangeHandler}
              color="success"
              fullWidth
              type="date"
              name="CompanyManagementBirthday"
              autoComplete="off"
              error={Boolean(getFieldError('CompanyManagementBirthday'))}
              helperText={getFieldError('CompanyManagementBirthday')}
            />
          </Grid>
          <Typography component="h1" variant="h5" sx={{ mt: 1 }}>
            Контактное лицо
          </Typography>
          <Grid item xs={12}>
            <TextField
              value={state.contactPersonName}
              onChange={inputChangeHandler}
              color="success"
              fullWidth
              label="ФИО"
              type="text"
              name="contactPersonName"
              autoComplete="off"
              error={Boolean(getFieldError('contactPersonName'))}
              helperText={getFieldError('contactPersonName')}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              value={state.contactPersonJobTitle}
              onChange={inputChangeHandler}
              color="success"
              fullWidth
              label="Должность"
              type="text"
              name="contactPersonJobTitle"
              autoComplete="off"
              error={Boolean(getFieldError('contactPersonJobTitle'))}
              helperText={getFieldError('contactPersonJobTitle')}
            />
          </Grid>
          <Grid item xs={12}>
            <Typography variant="subtitle1" sx={{ m: 0 }}>
              День рождение
            </Typography>
            <TextField
              value={state.contactPersonBirthday}
              onChange={inputChangeHandler}
              color="success"
              fullWidth
              type="date"
              name="contactPersonBirthday"
              autoComplete="off"
              error={Boolean(getFieldError('contactPersonBirthday'))}
              helperText={getFieldError('contactPersonBirthday')}
            />
          </Grid>
          <Typography component="h1" variant="h5" sx={{ mt: 1 }}>
            Рекламный канал
          </Typography>
          <Grid item>
            <TextField
              fullWidth
              multiline
              rows={5}
              color="success"
              label=" рекомендация знакомых, реклама в интернете итд..."
              value={state.advertisingChannel}
              onChange={inputChangeHandler}
              name="advertisingChannel"
              error={Boolean(getFieldError('advertisingChannel'))}
              helperText={getFieldError('advertisingChannel')}
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

export default FormCreateClient;

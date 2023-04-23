import React, { useState } from 'react';
import { LegalEntityMutation } from '../../../../types';
import { Avatar, Box, Button, CircularProgress, Grid, TextField, Typography } from '@mui/material';
import DomainAddIcon from '@mui/icons-material/DomainAdd';
import { useAppSelector } from '../../../../app/hooks';
import { selectCreateLegalEntityLoading, selectLegalEntityError } from '../legalEntitySlice';

interface Props {
  onSubmit: (entity: LegalEntityMutation) => void;
}

const FormCreateLegalEntity: React.FC<Props> = ({ onSubmit }) => {
  const createLoading = useAppSelector(selectCreateLegalEntityLoading);
  const error = useAppSelector(selectLegalEntityError);
  const [value, setValue] = useState('');

  const onFormSubmit = async (e: React.FormEvent) => {
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
        <DomainAddIcon />
      </Avatar>
      <Typography component="h1" variant="h5">
        Создать Юр. лицо
      </Typography>
      <Box component="form" sx={{ mt: 3, width: '100%' }} onSubmit={onFormSubmit}>
        <Grid container sx={{ flexDirection: 'column' }} spacing={2}>
          <Grid item xs={12}>
            <TextField
              value={value}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setValue(e.target.value)}
              required
              fullWidth
              label="Юридическое лицо"
              type="text"
              name="name"
              autoComplete="off"
              error={Boolean(getFieldError('name'))}
              helperText={getFieldError('name')}
            />
          </Grid>
        </Grid>
        <Button disabled={createLoading} type="submit" fullWidth variant="contained" sx={{ mt: 3, mb: 2 }}>
          {!createLoading ? 'Создать Юр. лицо' : <CircularProgress />}
        </Button>
      </Box>
    </Box>
  );
};

export default FormCreateLegalEntity;

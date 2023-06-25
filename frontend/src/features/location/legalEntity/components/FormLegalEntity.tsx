import React, { useEffect, useState } from 'react';
import { Avatar, Box, Button, CircularProgress, Grid, TextField, Typography } from '@mui/material';
import DomainAddIcon from '@mui/icons-material/DomainAdd';
import { useAppDispatch, useAppSelector } from '../../../../app/hooks';
import {
  selectCreateLegalEntityLoading,
  selectLegalEntityError,
  selectLegalEntityUpdateError,
  selectOneLegalEntity,
  selectUpdateLegalEntityLoading,
  unsetOneLegalEntity,
} from '../legalEntitySlice';
import { createLegalEntity, fetchLegalEntity, updateLegalEntity } from '../legalEntityThunk';
import { openSnackbar } from '../../../users/usersSlice';

interface Props {
  isEdit?: boolean;
}

const FormLegalEntity: React.FC<Props> = ({ isEdit = false }) => {
  const dispatch = useAppDispatch();
  const createLoading = useAppSelector(selectCreateLegalEntityLoading);
  const updateLoading = useAppSelector(selectUpdateLegalEntityLoading);
  const error = useAppSelector(selectLegalEntityError);
  const updateError = useAppSelector(selectLegalEntityUpdateError);
  const oneEntity = useAppSelector(selectOneLegalEntity);
  const [value, setValue] = useState('');

  useEffect(() => {
    if (isEdit && oneEntity) {
      setValue(oneEntity.name);
    }
  }, [isEdit, oneEntity]);

  const onFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (isEdit && oneEntity) {
      await dispatch(updateLegalEntity({ id: oneEntity._id, legalEntity: { name: value } })).unwrap();
      dispatch(openSnackbar({ status: true, parameter: 'update_legal_entity' }));
      dispatch(unsetOneLegalEntity());
    } else if (!isEdit) {
      await dispatch(createLegalEntity({ name: value })).unwrap();
      dispatch(openSnackbar({ status: true, parameter: 'create_legal_entity' }));
    }
    await dispatch(fetchLegalEntity());
    setValue('');
  };

  const getFieldError = (fieldName: string) => {
    try {
      return isEdit ? updateError?.errors[fieldName].message : error?.errors[fieldName].message;
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
        <DomainAddIcon color="success" />
      </Avatar>
      <Typography component="h1" variant="h5">
        {isEdit ? 'Редактировать Юр. лицо' : 'Создать Юр. лицо'}
      </Typography>
      <Box component="form" sx={{ mt: 3, width: '100%' }} onSubmit={onFormSubmit}>
        <Grid container sx={{ flexDirection: 'column' }} spacing={2}>
          <Grid item xs={12}>
            <TextField
              value={value}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setValue(e.target.value)}
              color="success"
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
        <Button
          color="success"
          disabled={isEdit ? createLoading : updateLoading}
          type="submit"
          fullWidth
          variant="contained"
          sx={{ mt: 3, mb: 2 }}
        >
          {isEdit ? (
            <>{!updateLoading ? 'Редактировать' : <CircularProgress color="success" />}</>
          ) : (
            <>{!createLoading ? 'Создать Юр. лицо' : <CircularProgress color="success" />}</>
          )}
        </Button>
      </Box>
    </Box>
  );
};

export default FormLegalEntity;

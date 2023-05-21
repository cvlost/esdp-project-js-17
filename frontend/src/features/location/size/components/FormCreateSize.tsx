import React, { useState } from 'react';
import { Avatar, Box, Button, CircularProgress, Grid, TextField, Typography } from '@mui/material';
import FormatSizeOutlinedIcon from '@mui/icons-material/FormatSizeOutlined';
import { useAppSelector } from '../../../../app/hooks';
import { SizeMutation } from '../../../../types';
import { selectSizeCreateLoading, selectSizeError } from '../sizeSlice';

interface Props {
  onSubmit: (size: SizeMutation) => void;
}

const FormCreateDirection: React.FC<Props> = ({ onSubmit }) => {
  const createLoading = useAppSelector(selectSizeCreateLoading);
  const error = useAppSelector(selectSizeError);
  const [value, setValue] = useState('');

  const onFormSubmit = (e: React.FormEvent) => {
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
      <Avatar sx={{ m: 1 }}>
        <FormatSizeOutlinedIcon color="success" />
      </Avatar>
      <Typography component="h1" variant="h5">
        Создать размер
      </Typography>
      <Box component="form" sx={{ mt: 3, width: '100%' }} onSubmit={onFormSubmit}>
        <Grid container sx={{ flexDirection: 'column' }} spacing={2}>
          <Grid item xs={12}>
            <TextField
              value={value}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setValue(e.target.value)}
              required
              fullWidth
              label="Размер"
              type="text"
              name="name"
              autoComplete="off"
              inputProps={{
                pattern: '^\\d+(,\\d+)?x\\d+(,\\d+)?$',
                title: 'Введите размер в формате "число x число"',
              }}
              error={Boolean(getFieldError('name'))}
              helperText={getFieldError('name')}
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
          {!createLoading ? 'Создать размер' : <CircularProgress />}
        </Button>
      </Box>
    </Box>
  );
};

export default FormCreateDirection;

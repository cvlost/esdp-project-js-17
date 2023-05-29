import React, { useState } from 'react';
import { Avatar, Box, Button, CircularProgress, Grid, TextField, Typography } from '@mui/material';
import FormatSizeOutlinedIcon from '@mui/icons-material/FormatSizeOutlined';
import { SizeMutation, ValidationError } from '../../../../types';
interface Props {
  onSubmit: (size: SizeMutation) => void;
  existingSize?: SizeMutation;
  isEdit?: boolean;
  Loading: boolean;
  error: ValidationError | null;
}

const initialState: SizeMutation = {
  name: '',
};

const FormCreateDirection: React.FC<Props> = ({ onSubmit, existingSize = initialState, error, isEdit, Loading }) => {
  const [value, setValue] = useState<SizeMutation>(existingSize);

  const onFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(value);
    setValue({ name: '' });
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
        {Loading ? <CircularProgress /> : isEdit ? 'Редактировать размер' : 'Создать размер'}
      </Typography>
      <Box component="form" sx={{ mt: 3, width: '100%' }} onSubmit={onFormSubmit}>
        <Grid container sx={{ flexDirection: 'column' }} spacing={2}>
          <Grid item xs={12}>
            <TextField
              value={value.name}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setValue({ name: e.target.value })}
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
        <Button disabled={Loading} type="submit" fullWidth variant="contained" color="success" sx={{ mt: 3, mb: 2 }}>
          {Loading ? <CircularProgress /> : isEdit ? 'Редактировать размер' : 'Создать'}
        </Button>
      </Box>
    </Box>
  );
};

export default FormCreateDirection;

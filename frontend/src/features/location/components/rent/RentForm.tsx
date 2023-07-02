import React, { useEffect, useState } from 'react';
import { DateRangePicker } from 'rsuite';
import ModalBody from '../../../../components/ModalBody';
import { Alert, Box, Button, CircularProgress, Grid, MenuItem, TextField, Typography } from '@mui/material';
import { RentMutation } from '../../../../types';
import { useAppDispatch, useAppSelector } from '../../../../app/hooks';
import { selectClientsList } from '../../client/clientSlice';
import { fetchClients } from '../../client/clientThunk';
import { DateRange } from 'rsuite/DateRangePicker';
import { Link } from 'react-router-dom';
import { selectCreateRentError, selectCreateRentLoading, selectOneLocation } from '../../locationsSlice';
import { openSnackbar } from '../../../users/usersSlice';
import useConfirm from '../../../../components/Dialogs/Confirm/useConfirm';
import { getOneLocation } from '../../locationsThunks';

interface Props {
  isOpen: boolean;
  closeRentForm: React.MouseEventHandler;
  onSubmit: (rent: RentMutation) => void;
  locationId: string;
  clearLocationRent: React.MouseEventHandler;
}

const RentForm: React.FC<Props> = ({ isOpen, closeRentForm, onSubmit, locationId, clearLocationRent }) => {
  const dispatch = useAppDispatch();
  const clients = useAppSelector(selectClientsList);
  const loading = useAppSelector(selectCreateRentLoading);
  const error = useAppSelector(selectCreateRentError);
  const { confirm } = useConfirm();
  const onLocation = useAppSelector(selectOneLocation);

  useEffect(() => {
    if (isOpen) {
      dispatch(fetchClients());
      dispatch(getOneLocation(locationId));
    }
  }, [dispatch, isOpen, locationId]);

  const [state, setState] = useState<RentMutation>({
    date: null,
    client: '',
    rent_cost: '',
  });

  const submitFormHandler = async (event: React.FormEvent) => {
    event.preventDefault();
    if (await confirm('Уведомление', 'Вы действительно хотите обновить и сохранить историю аренды?')) {
      try {
        onSubmit(state);
        dispatch(openSnackbar({ status: true, parameter: 'update_rent' }));
        setState({
          date: null,
          client: '',
          rent_cost: '',
        });
      } catch (error) {
        console.error(error);
      }
    } else {
      return;
    }
  };

  const inputChangeHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
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

  const dateChangeHandler = (value: DateRange | null) => {
    setState((prevState) => {
      return { ...prevState, date: value };
    });
  };

  return (
    <ModalBody isOpen={isOpen} onClose={closeRentForm}>
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <Typography component="h1" variant="h5" sx={{ mb: 2 }}>
          Обновление аренды
        </Typography>
        <Grid component="form" onSubmit={submitFormHandler} container direction="column" spacing={2}>
          <Grid item>{error && <Alert severity="error">{error.message}</Alert>}</Grid>
          <Grid item>
            <TextField
              fullWidth
              select
              value={state.client}
              autoComplete="off"
              name="client"
              label="Клиент"
              color="success"
              onChange={inputChangeHandler}
              error={Boolean(getFieldError('client'))}
              helperText={getFieldError('client')}
              required
            >
              <MenuItem value="" disabled>
                Выберите клиента
              </MenuItem>
              {clients &&
                clients
                  .filter((item) => item.companyName !== onLocation?.client)
                  .map((client) => (
                    <MenuItem key={client._id} value={client._id}>
                      {client.companyName}
                    </MenuItem>
                  ))}
            </TextField>
            <Link
              to="/create_client"
              style={{ display: 'block', textAlign: 'center', margin: '5px 0', color: 'green' }}
            >
              Нет клиента в списке? Создать клиента
            </Link>
          </Grid>
          <Grid item>
            <TextField
              fullWidth
              label="Стоимость аренды"
              type="number"
              color="success"
              name="rent_cost"
              autoComplete="off"
              value={state.rent_cost}
              onChange={inputChangeHandler}
              error={Boolean(getFieldError('rent_cost'))}
              helperText={getFieldError('rent_cost')}
              required
            />
          </Grid>
          <Grid item>
            <DateRangePicker
              block
              style={{ zIndex: '1' }}
              placement="topStart"
              value={state.date}
              onChange={dateChangeHandler}
              placeholder="Выберите дату аренды"
            />
          </Grid>
          <Grid item sx={{ display: 'flex', gap: '5px', justifyContent: 'center' }}>
            <Button
              type="submit"
              variant="contained"
              color="success"
              sx={{ mt: 3, mb: 2 }}
              disabled={loading || state.date === null}
            >
              {loading ? <CircularProgress size="small" color="success" /> : 'Обновить аренду'}
            </Button>
            <Button onClick={clearLocationRent} variant="contained" color="success" sx={{ mt: 3, mb: 2 }}>
              Очистить
            </Button>
            <Button
              component={Link}
              to={`/rentHistory/${locationId}`}
              variant="contained"
              color="success"
              sx={{
                mt: 3,
                mb: 2,
                '&:hover': {
                  color: 'white',
                },
              }}
            >
              История аренды
            </Button>
          </Grid>
        </Grid>
      </Box>
    </ModalBody>
  );
};

export default RentForm;

import React, { useEffect, useState } from 'react';
import { DateRangePicker } from 'rsuite';
import ModalBody from '../../../components/ModalBody';
import { Box, Button, Grid, MenuItem, TextField, Typography } from '@mui/material';
import { RentMutation } from '../../../types';
import { useAppDispatch, useAppSelector } from '../../../app/hooks';
import { selectClientsList } from '../client/clientSlice';
import { fetchClients } from '../client/clientThunk';
import { DateRange } from 'rsuite/DateRangePicker';
import { Link } from 'react-router-dom';

interface Props {
  isOpen: boolean;
  closeRentForm: React.MouseEventHandler;
  onSubmit: (rent: RentMutation) => void;
}

const RentForm: React.FC<Props> = ({ isOpen, closeRentForm, onSubmit }) => {
  const dispatch = useAppDispatch();
  const clients = useAppSelector(selectClientsList);

  useEffect(() => {
    if (isOpen) {
      dispatch(fetchClients());
    }
  }, [dispatch, isOpen]);

  const [state, setState] = useState<RentMutation>({
    date: null,
    client: '',
  });

  const submitFormHandler = async (event: React.FormEvent) => {
    event.preventDefault();
    onSubmit(state);
    setState({
      date: null,
      client: '',
    });
  };

  const inputChangeHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setState((prevState) => {
      return { ...prevState, [name]: value };
    });
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
          <Grid item>
            <TextField
              fullWidth
              select
              value={state.client}
              name="client"
              label="Клиент"
              required
              onChange={inputChangeHandler}
            >
              <MenuItem value="" disabled>
                Выберите клиента
              </MenuItem>
              {clients &&
                clients.map((client) => (
                  <MenuItem key={client._id} value={client._id}>
                    {client.name}
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
            <DateRangePicker
              block
              style={{ zIndex: '1' }}
              placement="topStart"
              value={state.date}
              onChange={dateChangeHandler}
              placeholder="Выберите дату аренды"
            />
          </Grid>
          <Grid item alignSelf="center">
            <Button type="submit" variant="contained" color="success" sx={{ mt: 3, mb: 2 }}>
              Обновить аренду
            </Button>
          </Grid>
        </Grid>
      </Box>
    </ModalBody>
  );
};

export default RentForm;

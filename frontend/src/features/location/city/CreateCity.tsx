import React, { useEffect } from 'react';
import {
  Alert,
  Box,
  CircularProgress,
  Container,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@mui/material';
import { CityMutation } from '../../../types';
import { useAppDispatch, useAppSelector } from '../../../app/hooks';
import { openSnackbar, selectUser } from '../../users/usersSlice';
import SnackbarCard from '../../../components/SnackbarCard/SnackbarCard';
import { StyledTableCell } from '../../../constants';
import { Navigate } from 'react-router-dom';
import { selectCityList, selectGetAllCitiesLoading } from './citySlice';
import CardCity from './components/CardCity';
import { createCity, fetchCities, removeCity } from './cityThunk';
import FormCreateCity from './components/FormCreateCity';

const CreateCity = () => {
  const user = useAppSelector(selectUser);
  const dispatch = useAppDispatch();
  const fetchListCities = useAppSelector(selectCityList);
  const fetchLoading = useAppSelector(selectGetAllCitiesLoading);

  useEffect(() => {
    dispatch(fetchCities());
  }, [dispatch]);

  const onSubmit = async (city: CityMutation) => {
    await dispatch(createCity(city)).unwrap();
    await dispatch(fetchCities()).unwrap();
    dispatch(openSnackbar({ status: true, parameter: 'create_city' }));
  };

  const removeCardCity = async (id: string) => {
    if (window.confirm('Вы действительно хотите удалить ?')) {
      await dispatch(removeCity(id)).unwrap();
      await dispatch(fetchCities()).unwrap();
      dispatch(openSnackbar({ status: true, parameter: 'remove_city' }));
    } else {
      return;
    }
  };

  if (user?.role !== 'admin') {
    return <Navigate to="/login" />;
  }

  return (
    <>
      <Box>
        <Container component="main" maxWidth="xs">
          <FormCreateCity onSubmit={onSubmit} />
        </Container>
        <Container>
          <Paper elevation={3} sx={{ width: '100%', height: '500px', overflowX: 'hidden' }}>
            <TableContainer>
              <Table sx={{ minWidth: 650 }} aria-label="simple table">
                <TableHead>
                  <TableRow>
                    <StyledTableCell align="left">Город</StyledTableCell>
                    <StyledTableCell align="right">Управление</StyledTableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {!fetchLoading ? (
                    fetchListCities.length !== 0 ? (
                      fetchListCities.map((city) => (
                        <CardCity removeCardCity={() => removeCardCity(city._id)} key={city._id} city={city} />
                      ))
                    ) : (
                      <TableRow>
                        <TableCell>
                          <Alert severity="info">В данный момент районов нет</Alert>
                        </TableCell>
                      </TableRow>
                    )
                  ) : (
                    <TableRow>
                      <TableCell>
                        <CircularProgress />
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        </Container>
      </Box>
      <SnackbarCard />
    </>
  );
};

export default CreateCity;

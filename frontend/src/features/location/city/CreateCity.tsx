import React, { useEffect, useState } from 'react';
import {
  Alert,
  Box,
  CircularProgress,
  Collapse,
  Container,
  IconButton,
  Paper,
  styled,
  Table,
  TableBody,
  TableCell,
  tableCellClasses,
  TableContainer,
  TableHead,
  TableRow,
} from '@mui/material';
import { CityMutation } from '../../../types';
import { useAppDispatch, useAppSelector } from '../../../app/hooks';
import { openSnackbar, selectUser } from '../../users/usersSlice';
import SnackbarCard from '../../../components/SnackbarCard/SnackbarCard';
import { MainColorGreen } from '../../../constants';
import { Navigate } from 'react-router-dom';
import {
  controlModal,
  selectCityError,
  selectCityList,
  selectCreateCityLoading,
  selectErrorRemove,
  selectGetAllCitiesLoading,
  selectModal,
  selectOneCity,
  selectUpdateCityLoading,
} from './citySlice';
import CardCity from './components/CardCity';
import { createCity, fetchCities, fetchOneCity, removeCity, updateCity } from './cityThunk';
import FormCreateCity from './components/FormCreateCity';
import CloseIcon from '@mui/icons-material/Close';
import useConfirm from '../../../components/Dialogs/Confirm/useConfirm';
import ModalBody from '../../../components/ModalBody';
const CreateCity = () => {
  const user = useAppSelector(selectUser);
  const dispatch = useAppDispatch();
  const fetchListCities = useAppSelector(selectCityList);
  const fetchLoading = useAppSelector(selectGetAllCitiesLoading);
  const errorRemove = useAppSelector(selectErrorRemove);
  const open = useAppSelector(selectModal);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [Id, setId] = useState('');
  const existingCity = useAppSelector(selectOneCity);
  const updateLoading = useAppSelector(selectUpdateCityLoading);
  const createLoading = useAppSelector(selectCreateCityLoading);
  const error = useAppSelector(selectCityError);
  const { confirm } = useConfirm();
  const StyledTableCell = styled(TableCell)(({ theme }) => ({
    [`&.${tableCellClasses.head}`]: {
      backgroundColor: MainColorGreen,
      color: theme.palette.common.white,
    },
  }));

  useEffect(() => {
    dispatch(fetchCities());
  }, [dispatch]);

  const onSubmit = async (city: CityMutation) => {
    await dispatch(createCity(city)).unwrap();
    await dispatch(fetchCities()).unwrap();
    dispatch(openSnackbar({ status: true, parameter: 'create_city' }));
  };

  const removeCardCity = async (id: string) => {
    if (await confirm('Запрос на удаление', 'Вы действительно хотите удалить данный город?')) {
      await dispatch(removeCity(id)).unwrap();
      await dispatch(fetchCities()).unwrap();
      dispatch(openSnackbar({ status: true, parameter: 'remove_city' }));
    } else {
      return;
    }
  };

  const onFormSubmit = async (ToChange: CityMutation) => {
    if (await confirm('Уведомление', 'Вы действительно хотите отредактировать ?')) {
      try {
        await dispatch(updateCity({ id: Id, name: ToChange })).unwrap();
        await dispatch(fetchCities()).unwrap();
        dispatch(openSnackbar({ status: true, parameter: 'Main_Edit' }));
        setIsDialogOpen(false);
      } catch (error) {
        throw new Error(`Произошла ошибка: ${error}`);
      }
    } else {
      return;
    }
  };

  const openDialog = async (ID: string) => {
    await dispatch(fetchOneCity(ID));
    setId(ID);
    setIsDialogOpen(true);
  };

  if (user?.role !== 'admin') {
    return <Navigate to="/login" />;
  }

  return (
    <>
      <Box>
        <Container component="main" maxWidth="xs">
          <FormCreateCity onSubmit={onSubmit} error={error} Loading={createLoading} />
        </Container>
        <Container>
          {open && (
            <Collapse in={open}>
              <Alert
                action={
                  <IconButton
                    aria-label="close"
                    color="inherit"
                    size="small"
                    onClick={() => {
                      dispatch(controlModal(false));
                    }}
                  >
                    <CloseIcon fontSize="inherit" />
                  </IconButton>
                }
                sx={{ mb: 2 }}
                severity="error"
              >
                {errorRemove?.error}
              </Alert>
            </Collapse>
          )}
          <Paper elevation={3} sx={{ width: '100%', height: '500px', overflowX: 'hidden' }}>
            <TableContainer>
              <Table sx={{ minWidth: 150 }} aria-label="simple table">
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
                        <CardCity
                          removeCardCity={() => removeCardCity(city._id)}
                          key={city._id}
                          city={city}
                          onEditing={() => openDialog(city._id)}
                        />
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
                        <CircularProgress color="success" />
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        </Container>
      </Box>
      {existingCity && (
        <ModalBody isOpen={isDialogOpen} onClose={() => setIsDialogOpen(false)}>
          <FormCreateCity
            error={error}
            onSubmit={onFormSubmit}
            existingCity={existingCity}
            isEdit
            Loading={updateLoading}
          />
        </ModalBody>
      )}
      <SnackbarCard />
    </>
  );
};

export default CreateCity;

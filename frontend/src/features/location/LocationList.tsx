import React, { useEffect, useState } from 'react';
import {
  Box,
  Button,
  Chip,
  CircularProgress,
  Grid,
  IconButton,
  Pagination,
  Paper,
  styled,
  Table,
  TableBody,
  TableCell,
  tableCellClasses,
  TableContainer,
  TableHead,
  TableRow,
  ToggleButton,
  Tooltip,
} from '@mui/material';
import ModalBody from '../../components/ModalBody';
import CardLocation from './components/CardLocation';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import {
  addLocationId,
  resetFilter,
  resetLocationId,
  selectEditLocationError,
  selectGetItemsListLoading,
  selectLocationsColumnSettings,
  selectLocationsDeleteLoading,
  selectLocationsFilter,
  selectLocationsListData,
  selectLocationsListLoading,
  selectOneLocationEditLoading,
  selectOneLocationToEdit,
  selectSelectedLocationId,
  setCurrentPage,
  checkedLocation,
} from './locationsSlice';
import { MainColorGreen } from '../../constants';
import {
  clearRent,
  getItems,
  getLocationsList,
  getToEditOneLocation,
  removeLocation,
  updateLocation,
  updateRent,
} from './locationsThunks';
import LocationDrawer from './components/LocationDrawer';
import SettingsIcon from '@mui/icons-material/Settings';
import { openSnackbar } from '../users/usersSlice';
import SnackbarCard from '../../components/SnackbarCard/SnackbarCard';
import useConfirm from '../../components/Dialogs/Confirm/useConfirm';
import TuneIcon from '@mui/icons-material/Tune';
import LocationFilter from './components/LocationsFilter';
import LocationForm from './components/LocationForm';
import { LocationMutation, RentMutation } from '../../types';
import { fetchCities } from './city/cityThunk';
import { fetchStreet } from './street/streetThunks';
import ViewListIcon from '@mui/icons-material/ViewList';
import CloseIcon from '@mui/icons-material/Close';
import { Link } from 'react-router-dom';
import RentForm from './components/rent/RentForm';
import BookingForm from './components/BookingForm/BookingForm';
import BookingList from './components/BookingList';

const LocationList = () => {
  const dispatch = useAppDispatch();
  const locationsListData = useAppSelector(selectLocationsListData);
  const locationsListLoading = useAppSelector(selectLocationsListLoading);
  const existingLocation = useAppSelector(selectOneLocationToEdit);
  const editingError = useAppSelector(selectEditLocationError);
  const editingLoading = useAppSelector(selectOneLocationEditLoading);
  const columns = useAppSelector(selectLocationsColumnSettings);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [isRentOpen, setIsRentOpen] = useState(false);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [locationID, setLocationID] = useState('');
  const deleteLoading = useAppSelector(selectLocationsDeleteLoading);
  const filter = useAppSelector(selectLocationsFilter);
  const { confirm } = useConfirm();
  const [open, setOpen] = useState(false);
  const listLocationId = useAppSelector(selectSelectedLocationId);
  const getItemsLoading = useAppSelector(selectGetItemsListLoading);
  const [openBooking, setOpenBooking] = useState(false);
  const [openBookingList, setOpenBookingList] = useState(false);

  const openDialog = async (id: string) => {
    await dispatch(getItems());
    await dispatch(fetchCities());
    await dispatch(fetchStreet());
    await dispatch(getToEditOneLocation(id));
    setLocationID(id);
    setIsOpen(true);
  };

  const onRentUpdateSubmit = async (rent: RentMutation) => {
    await dispatch(updateRent({ rent, id: locationID }));
    await dispatch(
      getLocationsList({
        page: locationsListData.page,
        perPage: locationsListData.perPage,
        filtered: filter.filtered,
      }),
    );
    setIsRentOpen(false);
  };

  const openRentDialog = (locationId: string) => {
    setIsRentOpen(true);
    setLocationID(locationId);
  };

  const onFormSubmit = async (location: LocationMutation) => {
    if (await confirm('Уведомление', 'Вы действительно хотите отредактировать ?')) {
      try {
        await dispatch(updateLocation({ id: locationID, locEdit: location })).unwrap();
        dispatch(openSnackbar({ status: true, parameter: 'edit_location' }));
        setIsOpen(false);
        await dispatch(
          getLocationsList({
            page: locationsListData.page,
            perPage: locationsListData.perPage,
            filtered: filter.filtered,
          }),
        );
      } catch (error) {
        console.error(error);
      }
    } else {
      return;
    }
  };

  useEffect(() => {
    dispatch(
      getLocationsList({
        page: locationsListData.page,
        perPage: locationsListData.perPage,
        filtered: filter.filtered,
      }),
    );
  }, [dispatch, filter.filtered, locationsListData.page, locationsListData.perPage]);

  const DeleteLocations = async (_id: string) => {
    if (await confirm('Запрос на удаление', 'Вы действительно хотите удалить данную локацию?')) {
      await dispatch(removeLocation(_id)).unwrap();
      await dispatch(getLocationsList());
      dispatch(openSnackbar({ status: true, parameter: 'remove_locations' }));
    }
  };

  const StyledTableCell = styled(TableCell)(({ theme }) => ({
    [`&.${tableCellClasses.head}`]: {
      backgroundColor: MainColorGreen,
      color: theme.palette.common.white,
    },
  }));

  const checkedCardLocation = (id: string) => {
    dispatch(checkedLocation(id));
    dispatch(addLocationId());
  };

  const resetCardLocationId = () => {
    dispatch(resetLocationId());
  };

  const openBookingModal = (name: string, id: string) => {
    if (name === 'list') setOpenBookingList(true);
    else if (name === 'booking') setOpenBooking(true);
    setLocationID(id);
  };

  const clearLocRent = async () => {
    await dispatch(clearRent(locationID));
    setIsRentOpen(false);
  };

  return (
    <Box sx={{ py: 2 }}>
      <Grid container alignItems="center" mb={2}>
        <Grid item>
          <Chip
            sx={{ fontSize: '20px', p: 3, color: MainColorGreen, mb: 2 }}
            label={
              (locationsListData.filtered ? `Подходящие локации: ` : `Общее количество локаций: `) +
              locationsListData.count
            }
            variant="outlined"
            color="success"
          />
        </Grid>
        <Grid item>
          <IconButton onClick={() => setIsDrawerOpen(true)} sx={{ ml: 1 }}>
            <SettingsIcon />
          </IconButton>
        </Grid>
        <Grid item>
          <IconButton onClick={() => setIsFilterOpen(true)} sx={{ ml: 1 }}>
            <TuneIcon />
          </IconButton>
        </Grid>
        {locationsListData.filtered && (
          <Grid item>
            <Button onClick={() => dispatch(resetFilter())}>Сбросить фильтр</Button>
          </Grid>
        )}
        <Grid marginLeft="auto" item>
          {locationsListData.locations.filter((item) => item.checked).length > 3 && (
            <Button sx={{ mr: 2 }} color="success" onClick={resetCardLocationId} size="large" variant="contained">
              Сбросить предложение
            </Button>
          )}
          <Button
            component={Link}
            sx={{
              mr: 1,
              '&:hover': {
                color: 'white',
              },
            }}
            disabled={listLocationId.length <= 0}
            size="large"
            variant="contained"
            color="success"
            to={'constructor_link'}
          >
            Создать ссылку
          </Button>
          <Tooltip title={!open ? 'Открыть выбор' : 'Закрыть выбор'} placement="top">
            <ToggleButton onClick={() => setOpen((prev) => !prev)} value="list" aria-label="list">
              {!open ? <ViewListIcon /> : <CloseIcon />}
            </ToggleButton>
          </Tooltip>
        </Grid>
      </Grid>
      <Paper elevation={3} sx={{ width: '100%', minHeight: '600px', overflowX: 'hidden' }}>
        <TableContainer>
          <Table sx={{ minWidth: 650 }}>
            <TableHead>
              <TableRow>
                <StyledTableCell align="right" sx={{ bgcolor: MainColorGreen }}>
                  №
                </StyledTableCell>
                {columns
                  .filter((col) => col.show)
                  .map((col) => (
                    <StyledTableCell align="center" key={col.id}>
                      {col.prettyName}
                    </StyledTableCell>
                  ))}
                <StyledTableCell align="right">Управление</StyledTableCell>
              </TableRow>
            </TableHead>
            <TableBody
              sx={{
                '& tr': {
                  cursor: 'pointer',
                  transition: 'background-color 0.2s',
                },
                '& tr:hover:nth-of-type(even)': {
                  bgcolor: '#f1f1f1',
                  transition: 'background-color 0.2s',
                },
                '& tr:hover:nth-of-type(odd)': {
                  bgcolor: '#cfe5f5',
                  transition: 'background-color 0.2s',
                },
              }}
            >
              {locationsListData.locations.map((loc, i) => (
                <CardLocation
                  rentOpen={() => openRentDialog(loc._id)}
                  onDelete={() => DeleteLocations(loc._id)}
                  deleteLoading={deleteLoading}
                  key={loc._id}
                  loc={loc}
                  number={(locationsListData.page - 1) * locationsListData.perPage + i + 1}
                  onEdit={() => openDialog(loc._id)}
                  checkedCardLocation={() => checkedCardLocation(loc._id)}
                  open={open}
                  openBooking={() => openBookingModal('booking', loc._id)}
                  openBookingList={() => openBookingModal('list', loc._id)}
                />
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
      <Pagination
        size="small"
        sx={{ display: 'flex', justifyContent: 'center', mt: '20px' }}
        disabled={locationsListLoading}
        count={locationsListData.pages}
        page={locationsListData.page}
        onChange={(event, page) => dispatch(setCurrentPage(page))}
      />
      {existingLocation !== null && (
        <ModalBody isOpen={isOpen} onClose={() => setIsOpen(false)}>
          {!getItemsLoading ? (
            <LocationForm
              onSubmit={onFormSubmit}
              isLoading={editingLoading}
              error={editingError}
              existingLocation={existingLocation}
              isEdit
            />
          ) : (
            <CircularProgress color="success" />
          )}
        </ModalBody>
      )}
      <ModalBody isOpen={isFilterOpen} onClose={() => setIsFilterOpen(false)}>
        <LocationFilter onClose={() => setIsFilterOpen(false)} />
      </ModalBody>
      <ModalBody isOpen={openBooking} onClose={() => setOpenBooking(false)}>
        <BookingForm closeModal={() => setOpenBooking(false)} locationId={locationID} />
      </ModalBody>
      <ModalBody isOpen={openBookingList} onClose={() => setOpenBookingList(false)} maxWidth="md">
        <BookingList locationId={locationID} />
      </ModalBody>
      <RentForm
        clearLocationRent={clearLocRent}
        locationId={locationID}
        onSubmit={onRentUpdateSubmit}
        isOpen={isRentOpen}
        closeRentForm={() => setIsRentOpen(false)}
      />
      <LocationDrawer isOpen={isDrawerOpen} onClose={() => setIsDrawerOpen(false)} />
      <SnackbarCard />
    </Box>
  );
};

export default LocationList;

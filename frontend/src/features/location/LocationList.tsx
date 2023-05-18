import React, { useEffect, useState } from 'react';
import {
  Box,
  Button,
  Chip,
  Dialog,
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
  selectEditLocationError,
  resetFilter,
  selectLocationsColumnSettings,
  selectLocationsDeleteLoading,
  selectLocationsFilter,
  selectLocationsListData,
  selectLocationsListLoading,
  selectOneLocationEditLoading,
  selectOneLocationToEdit,
  setCurrentPage,
} from './locationsSlice';
import { MainColorGreen } from '../../constants';
import { getLocationsList, getToEditOneLocation, removeLocation, updateLocation } from './locationsThunks';
import LocationDrawer from './components/LocationDrawer';
import SettingsIcon from '@mui/icons-material/Settings';
import { openSnackbar } from '../users/usersSlice';
import SnackbarCard from '../../components/SnackbarCard/SnackbarCard';
import useConfirm from '../../components/Dialogs/Confirm/useConfirm';
import TuneIcon from '@mui/icons-material/Tune';
import LocationFilter from './components/LocationsFilter';
import LocationForm from './components/LocationForm';
import { LocationMutation } from '../../types';
import { fetchCities } from './city/cityThunk';
import { fetchStreet } from './street/streetThunks';
import { fetchAreas } from './area/areaThunk';
import { fetchRegions } from './region/regionThunk';
import { fetchFormat } from './format/formatThunk';
import { fetchLegalEntity } from './legalEntity/legalEntityThunk';
import { getDirectionsList } from './direction/directionsThunks';
import ViewListIcon from '@mui/icons-material/ViewList';

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
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [locationID, setLocationID] = useState('');
  const deleteLoading = useAppSelector(selectLocationsDeleteLoading);
  const filter = useAppSelector(selectLocationsFilter);
  const { confirm } = useConfirm();

  const openDialog = async (id: string) => {
    await dispatch(fetchCities());
    await dispatch(fetchStreet());
    await dispatch(fetchAreas());
    await dispatch(fetchRegions());
    await dispatch(fetchFormat());
    await dispatch(fetchLegalEntity());
    await dispatch(getDirectionsList());
    await dispatch(getToEditOneLocation(id));
    setLocationID(id);
    setIsOpen(true);
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

  return (
    <Box sx={{ py: 2 }}>
      <Grid container alignItems="center" mb={2}>
        <Grid item>
          <Chip
            sx={{ fontSize: '20px', p: 3, color: MainColorGreen }}
            label={(locationsListData.filtered ? `Подходящие локации: ` : `Список локаций: `) + locationsListData.count}
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
          <Tooltip title="Открыть выбор" placement="top">
            <ToggleButton value="list" aria-label="list">
              <ViewListIcon />
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
                  onDelete={() => DeleteLocations(loc._id)}
                  deleteLoading={deleteLoading}
                  key={loc._id}
                  loc={loc}
                  number={(locationsListData.page - 1) * locationsListData.perPage + i + 1}
                  onEdit={() => openDialog(loc._id)}
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
          <LocationForm
            onSubmit={onFormSubmit}
            isLoading={editingLoading}
            error={editingError}
            existingLocation={existingLocation}
            isEdit
          />
        </ModalBody>
      )}
      <Dialog open={isFilterOpen} onClose={() => setIsFilterOpen(false)} fullWidth maxWidth="md">
        <LocationFilter onClose={() => setIsFilterOpen(false)} />
      </Dialog>
      <LocationDrawer isOpen={isDrawerOpen} onClose={() => setIsDrawerOpen(false)} />
      <SnackbarCard />
    </Box>
  );
};

export default LocationList;

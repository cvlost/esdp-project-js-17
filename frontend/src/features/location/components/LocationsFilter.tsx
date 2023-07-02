import React, { useEffect } from 'react';
import {
  Autocomplete,
  Box,
  Button,
  CircularProgress,
  Grid,
  TextField,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
} from '@mui/material';
import { useAppDispatch, useAppSelector } from '../../../app/hooks';
import {
  resetFilter,
  selectLocationsFilter,
  selectLocationsFilterCriteriaData,
  selectLocationsFilterCriteriaLoading,
  selectLocationsListData,
  selectLocationsListLoading,
  setFilter,
} from '../locationsSlice';
import { getFilterCriteriaData, getLocationsList } from '../locationsThunks';
import { LoadingButton } from '@mui/lab';
import SearchIcon from '@mui/icons-material/Search';
import RoomIcon from '@mui/icons-material/Room';
import ViewQuiltIcon from '@mui/icons-material/ViewQuilt';
import TuneIcon from '@mui/icons-material/Tune';
import { FilterEntity } from '../../../types';

interface Props {
  onClose: () => void;
}

const LocationFilter: React.FC<Props> = ({ onClose }) => {
  const dispatch = useAppDispatch();
  const filter = useAppSelector(selectLocationsFilter);
  const criteriaData = useAppSelector(selectLocationsFilterCriteriaData);
  const criteriaDataLoading = useAppSelector(selectLocationsFilterCriteriaLoading);
  const listLoading = useAppSelector(selectLocationsListLoading);
  const perPage = useAppSelector(selectLocationsListData).perPage;
  const { streets, areas, formats, regions, cities, directions, sizes, legalEntities, lightings } =
    criteriaData.criteria;

  const handleFilterChange = (filterSlice: FilterEntity) => {
    dispatch(setFilter(filterSlice));
    dispatch(getFilterCriteriaData());
  };

  useEffect(() => {
    dispatch(getFilterCriteriaData());
  }, [dispatch]);

  return (
    <Box sx={{ pb: 5 }}>
      <Box sx={{ position: 'sticky', top: 0, bgcolor: 'white', boxShadow: '0 0 .5em gainsboro', zIndex: 1 }}>
        <Grid container alignItems="center" p={2}>
          <Grid item>
            <Box display="flex" alignItems="center">
              <TuneIcon />
              <Typography fontWeight="bold" color="#555" mx={1}>
                Фильтр
              </Typography>
            </Box>
          </Grid>
          <Grid item mx="auto">
            <Typography fontWeight="bold" color="#555">
              Найдено:{' '}
              <Typography
                component="span"
                variant="h6"
                fontSize="inherit"
                fontWeight="bold"
                color={criteriaData.count ? '#1976d2' : 'darkorange'}
              >
                {criteriaDataLoading ? <CircularProgress color="success" size={14} /> : criteriaData.count}
              </Typography>
            </Typography>
          </Grid>
          <Grid item ml={1}>
            <Button
              size="small"
              sx={{ textTransform: 'none' }}
              onClick={() => {
                dispatch(resetFilter());
                dispatch(getFilterCriteriaData());
              }}
            >
              Сбросить
            </Button>
          </Grid>
          <Grid item ml={1}>
            <LoadingButton
              size="small"
              loading={listLoading}
              disabled={!criteriaData.count || criteriaDataLoading}
              variant="contained"
              loadingPosition="start"
              color="success"
              startIcon={<SearchIcon />}
              onClick={async () => {
                dispatch(setFilter({ filtered: true }));
                await dispatch(getLocationsList({ filtered: true, page: 1, perPage }));
                onClose();
              }}
            >
              Показать
            </LoadingButton>
          </Grid>
        </Grid>
      </Box>
      <Grid container px={2} spacing={2} justifyContent="center">
        <Grid item xs={12} sm={8} md={6}>
          <Box>
            <Grid container spacing={1}>
              <Grid item xs={12}>
                <Box
                  sx={{ display: 'flex', alignItems: 'center', color: '#555', justifyContent: 'center', mt: 4, mb: 2 }}
                >
                  <RoomIcon sx={{ mr: 1 }} />
                  <Typography fontWeight="bold">Локация</Typography>
                </Box>
              </Grid>
              <Grid item xs={12}>
                <Autocomplete
                  size="small"
                  fullWidth
                  multiple
                  value={filter.areas}
                  options={areas}
                  isOptionEqualToValue={(option, value) => option._id === value._id}
                  onChange={(event, value) => handleFilterChange({ areas: value })}
                  getOptionLabel={(option) => option.name}
                  renderInput={(params) => (
                    <TextField {...params} variant="standard" label="Области" placeholder="Области" />
                  )}
                />
              </Grid>
              <Grid item xs={12}>
                <Autocomplete
                  size="small"
                  fullWidth
                  multiple
                  value={filter.cities}
                  options={cities}
                  isOptionEqualToValue={(option, value) => option._id === value._id}
                  onChange={(event, value) => handleFilterChange({ cities: value })}
                  getOptionLabel={(option) => option.name}
                  renderInput={(params) => (
                    <TextField {...params} variant="standard" label="Город/Село" placeholder="Город/Село" />
                  )}
                />
              </Grid>
              <Grid item xs={12}>
                <Autocomplete
                  size="small"
                  fullWidth
                  multiple
                  value={filter.regions}
                  options={regions}
                  isOptionEqualToValue={(option, value) => option._id === value._id}
                  onChange={(event, value) => handleFilterChange({ regions: value })}
                  getOptionLabel={(option) => option.name}
                  renderInput={(params) => (
                    <TextField {...params} variant="standard" label="Районы" placeholder="Районы" />
                  )}
                />
              </Grid>
              <Grid item xs={12}>
                <Autocomplete
                  size="small"
                  fullWidth
                  multiple
                  value={filter.streets}
                  options={streets}
                  isOptionEqualToValue={(option, value) => option._id === value._id}
                  onChange={(event, value) => handleFilterChange({ streets: value })}
                  getOptionLabel={(option) => option.name}
                  renderInput={(params) => (
                    <TextField {...params} variant="standard" label="Улицы" placeholder="Улицы" />
                  )}
                />
              </Grid>
              <Grid item xs={12}>
                <Autocomplete
                  size="small"
                  fullWidth
                  multiple
                  value={filter.directions}
                  options={directions}
                  isOptionEqualToValue={(option, value) => option._id === value._id}
                  onChange={(event, value) => handleFilterChange({ directions: value })}
                  getOptionLabel={(option) => option.name}
                  renderInput={(params) => (
                    <TextField {...params} variant="standard" label="Стороны" placeholder="Стороны" />
                  )}
                />
              </Grid>
              <Grid item xs={12}>
                <Autocomplete
                  size="small"
                  fullWidth
                  multiple
                  value={filter.legalEntities}
                  options={legalEntities}
                  isOptionEqualToValue={(option, value) => option._id === value._id}
                  onChange={(event, value) => handleFilterChange({ legalEntities: value })}
                  getOptionLabel={(option) => option.name}
                  renderInput={(params) => (
                    <TextField {...params} variant="standard" label="Юр. лицо" placeholder="Юр. лицо" />
                  )}
                />
              </Grid>
            </Grid>
          </Box>
        </Grid>
        <Grid item xs={12} sm={8} md={6}>
          <Box>
            <Grid container spacing={1}>
              <Grid item xs={12}>
                <Box
                  sx={{ display: 'flex', alignItems: 'center', color: '#555', justifyContent: 'center', mt: 4, mb: 2 }}
                >
                  <ViewQuiltIcon sx={{ mr: 1 }} />
                  <Typography fontWeight="bold">Баннер</Typography>
                </Box>
              </Grid>
              <Grid item xs={12}>
                <Autocomplete
                  size="small"
                  fullWidth
                  multiple
                  value={filter.formats}
                  options={formats}
                  isOptionEqualToValue={(option, value) => option._id === value._id}
                  onChange={(event, value) => handleFilterChange({ formats: value })}
                  getOptionLabel={(option) => option.name}
                  renderInput={(params) => (
                    <TextField {...params} variant="standard" label="Форматы" placeholder="Форматы" />
                  )}
                />
              </Grid>
              <Grid item xs={12}>
                <Autocomplete
                  size="small"
                  fullWidth
                  multiple
                  value={filter.sizes}
                  options={sizes}
                  onChange={(event, value) => handleFilterChange({ sizes: value })}
                  isOptionEqualToValue={(option, value) => option._id === value._id}
                  getOptionLabel={(option) => option.name}
                  renderInput={(params) => (
                    <TextField {...params} variant="standard" label="Размеры" placeholder="Размеры" />
                  )}
                />
              </Grid>
              <Grid item xs={12}>
                <Autocomplete
                  size="small"
                  fullWidth
                  multiple
                  value={filter.lightings}
                  options={lightings}
                  onChange={(event, value) => handleFilterChange({ lightings: value })}
                  isOptionEqualToValue={(option, value) => option._id === value._id}
                  getOptionLabel={(option) => option.name}
                  renderInput={(params) => (
                    <TextField {...params} variant="standard" label="Освещение" placeholder="Освещение" />
                  )}
                />
              </Grid>
              <Grid item xs={12} container justifyContent="space-around">
                <Grid item>
                  <Typography color="gray" my={1} textAlign="center">
                    Расположение
                  </Typography>
                  <ToggleButtonGroup
                    orientation="vertical"
                    size="small"
                    color="primary"
                    value={filter.placement}
                    exclusive
                    onChange={(event, value: string | null) => {
                      if (value !== null) handleFilterChange({ placement: value });
                    }}
                  >
                    <ToggleButton value="all">Все</ToggleButton>
                    <ToggleButton value="placementTrueOnly">По направлению</ToggleButton>
                    <ToggleButton value="placementFalseOnly">Не по направлению</ToggleButton>
                  </ToggleButtonGroup>
                </Grid>
                <Grid item>
                  <Typography color="gray" my={1} textAlign="center">
                    Аренда
                  </Typography>
                  <ToggleButtonGroup
                    orientation="vertical"
                    size="small"
                    color="primary"
                    value={filter.rent}
                    exclusive
                    onChange={(event, value: string | null) => {
                      if (value !== null) handleFilterChange({ rent: value });
                    }}
                  >
                    <ToggleButton value="all">Все</ToggleButton>
                    <ToggleButton value="rentedOnly">В аренде</ToggleButton>
                    <ToggleButton value="freeOnly">Свободные</ToggleButton>
                  </ToggleButtonGroup>
                </Grid>
              </Grid>
            </Grid>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
};

export default LocationFilter;

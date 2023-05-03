import React, { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../../app/hooks';
import { LocationMutation, LocationSubmit, ValidationError } from '../../../types';
import { Alert, Button, Checkbox, CircularProgress, FormControlLabel, Grid, MenuItem, TextField } from '@mui/material';
import { selectAreaList } from '../area/areaSlice';
import { selectRegionList } from '../region/regionSlice';
import { selectCityList } from '../city/citySlice';
import { selectStreetList } from '../street/streetSlice';
import { selectDirections } from '../direction/directionsSlice';
import { selectLegalEntityList } from '../legalEntity/legalEntitySlice';
import FileInput from '../../../components/FileInput/FileInput';
import { BILLBOARD_SIZES } from '../../../constants';
import { selectFormatList } from '../format/formatSlice';
import { DateRange } from 'rsuite/DateRangePicker';
import { fetchAreas } from '../area/areaThunk';
import { fetchRegions } from '../region/regionThunk';
import { fetchCities } from '../city/cityThunk';
import { fetchFormat } from '../format/formatThunk';
import { fetchLegalEntity } from '../legalEntity/legalEntityThunk';
import { getDirectionsList } from '../direction/directionsThunks';
import { DateRangePicker, CustomProvider } from 'rsuite';
import ruRu from 'rsuite/locales/ru_RU';
import { fetchStreet } from '../street/streetThunks';

interface Props {
  onSubmit: (location: LocationSubmit) => void;
  isLoading: boolean;
  error: ValidationError | null;
}

const LocationForm: React.FC<Props> = ({ onSubmit, isLoading, error }) => {
  const [idState, setIdState] = useState({
    city: '',
    area: '',
  });

  const dispatch = useAppDispatch();
  const areas = useAppSelector(selectAreaList);
  const regions = useAppSelector(selectRegionList);
  const cities = useAppSelector(selectCityList);
  const streets = useAppSelector(selectStreetList);
  const directions = useAppSelector(selectDirections);
  const legalEntities = useAppSelector(selectLegalEntityList);
  const sizes = BILLBOARD_SIZES;
  const formats = useAppSelector(selectFormatList);
  const [state, setState] = useState<LocationMutation>({
    addressNote: '',
    description: '',
    country: 'Кыргызстан',
    area: '',
    region: '',
    city: '',
    street: '',
    direction: '',
    legalEntity: '',
    size: '',
    format: '',
    lighting: false,
    placement: false,
    rent: null,
    price: '',
    dayImage: null,
    schemaImage: null,
  });

  console.log(state);

  useEffect(() => {
    if (state.area !== '' && idState.area !== state.area) {
      dispatch(fetchCities(state.area));
      setIdState((prev) => ({ ...prev, area: state.area }));
      setState((prev) => ({ ...prev, street: '', city: '' }));
    }

    if (state.city && idState.city !== state.city) {
      dispatch(fetchStreet(state.city));
      setIdState((prev) => ({ ...prev, city: state.city }));
      setState((prev) => ({ ...prev, street: '' }));
    }

    if (state.area === '' && state.city === '') {
      dispatch(fetchAreas());
      dispatch(fetchRegions());
      dispatch(fetchFormat());
      dispatch(fetchLegalEntity());
      dispatch(getDirectionsList());
    }
  }, [dispatch, state.area, state.city, idState]);

  const submitFormHandler = async (event: React.FormEvent) => {
    event.preventDefault();

    const initial: LocationSubmit = {
      ...state,
      rent: {
        start: state.rent ? state.rent[0] : null,
        end: state.rent ? state.rent[1] : null,
      },
    };

    onSubmit(initial);
    setState({
      addressNote: '',
      description: '',
      country: 'Кыргызстан',
      area: '',
      region: '',
      city: '',
      street: '',
      direction: '',
      legalEntity: '',
      size: '',
      format: '',
      lighting: false,
      placement: false,
      rent: null,
      price: '',
      dayImage: null,
      schemaImage: null,
    });
  };

  const inputChangeHandler = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setState((prevState) => {
      return { ...prevState, [name]: value };
    });
  };

  const fileInputChangeHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, files } = e.target;
    setState((prevState) => ({
      ...prevState,
      [name]: files && files[0] ? files[0] : null,
    }));
  };

  const handleDateChange = (value: DateRange | null) => {
    setState((prevState) => ({
      ...prevState,
      rent: value,
    }));
  };

  const ligthingInputChangeHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    setState((prevState) => ({
      ...prevState,
      lighting: e.target.checked,
    }));
  };

  const placementInputChangHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    setState((prevState) => ({
      ...prevState,
      placement: e.target.checked,
    }));
  };

  return (
    <>
      {error && (
        <Alert severity="error" sx={{ mt: 3, width: '100%' }}>
          {error.message}
        </Alert>
      )}
      <Grid component="form" onSubmit={submitFormHandler} container direction="column" spacing={2}>
        <Grid item>
          <TextField
            fullWidth
            multiline
            rows={3}
            label="Полный адрес"
            name="addressNote"
            value={state.addressNote}
            onChange={inputChangeHandler}
            required
          />
        </Grid>
        <Grid item>
          <TextField
            fullWidth
            multiline
            rows={5}
            label="Дополнительная информация"
            value={state.description}
            onChange={inputChangeHandler}
            name="description"
          />
        </Grid>
        <Grid item>
          <TextField
            fullWidth
            select
            value={state.area}
            name="area"
            label="Область"
            onChange={inputChangeHandler}
            required
          >
            <MenuItem value="" disabled>
              Выберите область
            </MenuItem>
            {areas &&
              areas.map((area) => (
                <MenuItem key={area._id} value={area._id}>
                  {area.name}
                </MenuItem>
              ))}
          </TextField>
        </Grid>
        <Grid item>
          <TextField
            fullWidth
            select
            value={state.region}
            name="region"
            label="Район"
            onChange={inputChangeHandler}
            required
          >
            <MenuItem value="" disabled>
              Выберите район
            </MenuItem>
            {regions &&
              regions.map((region) => (
                <MenuItem key={region._id} value={region._id}>
                  {region.name}
                </MenuItem>
              ))}
          </TextField>
        </Grid>
        <Grid item>
          <TextField
            fullWidth
            select
            value={state.city}
            name="city"
            label="Город/село"
            onChange={inputChangeHandler}
            required
          >
            <MenuItem value="" disabled>
              Выберите город/село
            </MenuItem>
            {cities &&
              cities.map((city) => (
                <MenuItem key={city._id} value={city._id}>
                  {city.name}
                </MenuItem>
              ))}
          </TextField>
        </Grid>
        <Grid item>
          <TextField
            fullWidth
            select
            value={state.street}
            name="street"
            label="Улица"
            onChange={inputChangeHandler}
            required
          >
            <MenuItem value="" disabled>
              Выберите улицу
            </MenuItem>
            {streets &&
              streets.map((street) => (
                <MenuItem key={street._id} value={street._id}>
                  {street.name}
                </MenuItem>
              ))}
          </TextField>
        </Grid>
        <Grid item>
          <TextField
            fullWidth
            select
            value={state.direction}
            name="direction"
            label="Направление"
            onChange={inputChangeHandler}
            required
          >
            <MenuItem value="" disabled>
              Выберите направление
            </MenuItem>
            {directions &&
              directions.map((direction) => (
                <MenuItem key={direction._id} value={direction._id}>
                  {direction.name}
                </MenuItem>
              ))}
          </TextField>
        </Grid>
        <Grid item>
          <TextField
            fullWidth
            select
            value={state.legalEntity}
            name="legalEntity"
            label="Юридическое лицо"
            onChange={inputChangeHandler}
            required
          >
            <MenuItem value="" disabled>
              Выберите юрлицо
            </MenuItem>
            {legalEntities &&
              legalEntities.map((legalEnt) => (
                <MenuItem key={legalEnt._id} value={legalEnt._id}>
                  {legalEnt.name}
                </MenuItem>
              ))}
          </TextField>
        </Grid>
        <Grid item>
          <TextField
            fullWidth
            select
            value={state.size}
            name="size"
            label="Размер"
            onChange={inputChangeHandler}
            required
          >
            <MenuItem value="" disabled>
              Выберите размер
            </MenuItem>
            {sizes &&
              sizes.map((size) => (
                <MenuItem key={size} value={size}>
                  {size}
                </MenuItem>
              ))}
          </TextField>
        </Grid>
        <Grid item>
          <TextField
            fullWidth
            select
            value={state.format}
            name="format"
            label="Формат"
            onChange={inputChangeHandler}
            required
          >
            <MenuItem value="" disabled>
              Выберите формат
            </MenuItem>
            {formats &&
              formats.map((format) => (
                <MenuItem key={format._id} value={format._id}>
                  {format.name}
                </MenuItem>
              ))}
          </TextField>
        </Grid>
        <Grid item>
          <FormControlLabel
            control={<Checkbox checked={state.lighting} onChange={ligthingInputChangeHandler} required />}
            label="Внутреннее / внешнее освещение"
          />
        </Grid>
        <Grid item>
          <FormControlLabel
            control={<Checkbox checked={state.placement} onChange={placementInputChangHandler} required />}
            label="По направление / не по направлению"
          />
        </Grid>
        <Grid item>
          <TextField
            fullWidth
            type="number"
            label="Цена"
            name="price"
            value={state.price}
            onChange={inputChangeHandler}
            required
          />
        </Grid>
        <Grid item>
          <CustomProvider locale={ruRu}>
            <DateRangePicker placement="topStart" showWeekNumbers onChange={handleDateChange} />
          </CustomProvider>
        </Grid>
        <Grid item>
          <FileInput onChange={fileInputChangeHandler} name="dayImage" label="Фото дневного баннера" />
        </Grid>
        <Grid item>
          <FileInput onChange={fileInputChangeHandler} name="schemaImage" label="Фото схемы" />
        </Grid>
        <Grid item>
          <Button type="submit" color="primary" variant="contained" fullWidth>
            {isLoading ? <CircularProgress /> : 'Создать'}
          </Button>
        </Grid>
      </Grid>
    </>
  );
};

export default LocationForm;

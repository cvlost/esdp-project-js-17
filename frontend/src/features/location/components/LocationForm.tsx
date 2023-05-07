import React, { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../../app/hooks';
import { LocationMutation, LocationSubmit, ValidationError } from '../../../types';
import {
  Alert,
  Button,
  Card,
  CardContent,
  CardMedia,
  Checkbox,
  Chip,
  CircularProgress,
  FormControlLabel,
  Grid,
  MenuItem,
  TextField,
  Typography,
} from '@mui/material';
import { selectAreaList } from '../area/areaSlice';
import { selectRegionList } from '../region/regionSlice';
import { selectCityList } from '../city/citySlice';
import { selectStreetList } from '../street/streetSlice';
import { selectDirections } from '../direction/directionsSlice';
import { selectLegalEntityList } from '../legalEntity/legalEntitySlice';
import FileInput from '../../../components/FileInput/FileInput';
import { BILLBOARD_LIGHTINGS, BILLBOARD_SIZES } from '../../../constants';
import { selectFormatList } from '../format/formatSlice';
import { fetchAreas } from '../area/areaThunk';
import { fetchRegions } from '../region/regionThunk';
import { fetchCities } from '../city/cityThunk';
import { fetchFormat } from '../format/formatThunk';
import { fetchLegalEntity } from '../legalEntity/legalEntityThunk';
import { getDirectionsList } from '../direction/directionsThunks';
import { fetchStreet } from '../street/streetThunks';
import noImage from '../../../assets/noImage.png';

interface Props {
  onSubmit: (location: LocationSubmit) => void;
  isLoading: boolean;
  error: ValidationError | null;
}

const LocationForm: React.FC<Props> = ({ onSubmit, isLoading, error }) => {
  const [image, setImage] = useState<{ imageDay: string | null; imageSchema: null | string }>({
    imageDay: null,
    imageSchema: null,
  });
  const [idState, setIdState] = useState({
    city: '',
    area: '',
    region: '',
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
    lighting: '',
    placement: false,
    price: '',
    dayImage: null,
    schemaImage: null,
  });

  useEffect(() => {
    if (state.area !== '' && idState.area !== state.area) {
      dispatch(fetchCities(state.area));
      setIdState((prev) => ({ ...prev, area: state.area }));
      setState((prev) => ({ ...prev, street: '', city: '', region: '' }));
    }

    if (state.city && idState.city !== state.city) {
      if (cities.find((item) => item._id === state.city)?.name === 'Бишкек') {
        dispatch(fetchRegions(state.city));
      } else {
        dispatch(fetchStreet({ cityId: state.city }));
      }
      setState((prev) => ({ ...prev, street: '', region: '' }));
      setIdState((prev) => ({ ...prev, city: state.city }));
    }

    if (state.region && idState.region !== state.region) {
      dispatch(fetchStreet({ regionId: state.region }));
      setIdState((prev) => ({ ...prev, region: state.region }));
      setState((prev) => ({ ...prev, street: '' }));
    }

    if (state.area === '' && state.city === '') {
      dispatch(fetchAreas());
      dispatch(fetchRegions());
      dispatch(fetchFormat());
      dispatch(fetchLegalEntity());
      dispatch(getDirectionsList());
    }
  }, [dispatch, state.area, state.city, idState, state.region, cities]);

  const submitFormHandler = async (event: React.FormEvent) => {
    event.preventDefault();
    onSubmit(state);
  };

  const inputChangeHandler = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setState((prevState) => {
      return { ...prevState, [name]: value };
    });
  };

  const fileInputChangeHandler = (e: React.ChangeEvent<HTMLInputElement>, type: string) => {
    const { name, files } = e.target;
    setState((prevState) => ({
      ...prevState,
      [name]: files && files[0] ? files[0] : null,
    }));
    if (files) {
      const reader = new FileReader();
      reader.onload = () => {
        if (type === 'day') {
          setImage((prev) => ({ ...prev, imageDay: reader.result as string }));
        } else if (type === 'schema') {
          setImage((prev) => ({ ...prev, imageSchema: reader.result as string }));
        }
      };
      reader.readAsDataURL(files[0]);
    }
  };

  const placementInputChangHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    setState((prevState) => ({
      ...prevState,
      placement: e.target.checked,
    }));
  };

  const getFieldError = (fieldName: string) => {
    try {
      return error?.errors[fieldName].message;
    } catch {
      return undefined;
    }
  };

  const style: React.CSSProperties = {
    display: 'none',
  };

  const name = cities.find((item) => item._id === state.city);

  if (name && name.name !== 'Бишкек') {
    style.display = 'block';
  } else if (state.region.length > 0) {
    style.display = 'block';
  }

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
            select
            value={state.area}
            name="area"
            label="Область"
            onChange={inputChangeHandler}
            required
            error={Boolean(getFieldError('area'))}
            helperText={getFieldError('area')}
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
        <Grid sx={{ display: idState.area.length > 0 ? 'block' : 'none' }} item>
          <TextField
            fullWidth
            select
            value={state.city}
            name="city"
            label="Город/село"
            onChange={inputChangeHandler}
            required
            error={Boolean(getFieldError('city'))}
            helperText={getFieldError('city')}
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
        <Grid
          sx={{
            display:
              state.city.length > 0 && cities.find((item) => item._id === state.city)?.name === 'Бишкек'
                ? 'block'
                : 'none',
          }}
          item
        >
          <TextField
            fullWidth
            select
            value={state.region}
            name="region"
            label="Район"
            required={cities.find((item) => item._id === state.city)?.name === 'Бишкек'}
            onChange={inputChangeHandler}
            error={Boolean(getFieldError('region'))}
            helperText={getFieldError('region')}
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
        <Grid sx={style} item>
          <TextField
            fullWidth
            select
            value={state.street}
            name="street"
            label="Улица"
            onChange={inputChangeHandler}
            required
            error={Boolean(getFieldError('street'))}
            helperText={getFieldError('street')}
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
            multiline
            rows={3}
            label="Заметка к адресу"
            name="addressNote"
            value={state.addressNote}
            onChange={inputChangeHandler}
            error={Boolean(getFieldError('addressNote'))}
            helperText={getFieldError('addressNote')}
          />
        </Grid>
        <Grid item>
          <TextField
            fullWidth
            multiline
            rows={5}
            label="Описание"
            value={state.description}
            onChange={inputChangeHandler}
            name="description"
            error={Boolean(getFieldError('description'))}
            helperText={getFieldError('description')}
          />
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
            error={Boolean(getFieldError('direction'))}
            helperText={getFieldError('direction')}
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
            error={Boolean(getFieldError('legalEntity'))}
            helperText={getFieldError('legalEntity')}
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
            error={Boolean(getFieldError('size'))}
            helperText={getFieldError('size')}
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
            error={Boolean(getFieldError('format'))}
            helperText={getFieldError('format')}
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
          <TextField
            fullWidth
            select
            value={state.lighting}
            name="lighting"
            label="Освещение"
            onChange={inputChangeHandler}
            required
            error={Boolean(getFieldError('lighting'))}
            helperText={getFieldError('lighting')}
          >
            <MenuItem value="" disabled>
              Выберите освещение
            </MenuItem>
            {BILLBOARD_LIGHTINGS &&
              BILLBOARD_LIGHTINGS.map((lighting) => (
                <MenuItem key={lighting} value={lighting}>
                  {lighting}
                </MenuItem>
              ))}
          </TextField>
        </Grid>
        <Grid item>
          <FormControlLabel
            control={<Checkbox checked={state.placement} onChange={placementInputChangHandler} />}
            label="По направление / не по направлению"
          />
          <Chip label={state.placement ? 'по направлению' : 'не по направлению'} variant="outlined" />
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
            error={Boolean(getFieldError('price'))}
            helperText={getFieldError('price')}
          />
        </Grid>
        <Grid item>
          <FileInput
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => fileInputChangeHandler(e, 'day')}
            name="dayImage"
            label="Фото дневного баннера"
            error={Boolean(getFieldError('dayImage'))}
          />
        </Grid>
        <Grid item>
          <FileInput
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => fileInputChangeHandler(e, 'schema')}
            name="schemaImage"
            label="Фото схемы"
            error={Boolean(getFieldError('schemaImage'))}
          />
        </Grid>
        {image.imageDay !== null || image.imageSchema !== null ? (
          <Grid display="flex" flexWrap="wrap" justifyContent="space-between" item>
            <Card sx={{ maxWidth: 345 }}>
              <CardMedia component="img" height="194" image={image.imageDay || noImage} alt="Paella dish" />
              <CardContent>
                <Typography gutterBottom variant="h5" component="div">
                  День
                </Typography>
              </CardContent>
            </Card>
            <Card sx={{ maxWidth: 345 }}>
              <CardMedia component="img" height="194" image={image.imageSchema || noImage} alt="Paella dish" />
              <CardContent>
                <Typography gutterBottom variant="h5" component="div">
                  Cхема
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ) : null}
        <Grid item>
          <Button
            disabled={isLoading || state.dayImage === null || state.schemaImage === null}
            type="submit"
            color="primary"
            variant="contained"
            fullWidth
          >
            {isLoading ? <CircularProgress /> : 'Создать'}
          </Button>
        </Grid>
      </Grid>
    </>
  );
};

export default LocationForm;

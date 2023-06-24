import React, { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../../app/hooks';
import { LocationMutation, ValidationError } from '../../../types';
import {
  Avatar,
  Box,
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
import { selectCityList } from '../city/citySlice';
import { selectStreetList } from '../street/streetSlice';
import FileInput from '../../../components/FileInput/FileInput';
import { fetchRegions } from '../region/regionThunk';
import { fetchCities } from '../city/cityThunk';
import { fetchStreet } from '../street/streetThunks';
import noImage from '../../../assets/noImage.png';
import AddLocationIcon from '@mui/icons-material/AddLocation';
import { getItems } from '../locationsThunks';
import { selectItemsList } from '../locationsSlice';

interface Props {
  onSubmit: (location: LocationMutation) => void;
  isLoading: boolean;
  error: ValidationError | null;
  isEdit?: boolean;
  existingLocation?: LocationMutation;
}

const initialState = {
  addressNote: '',
  description: '',
  country: 'Кыргызстан',
  area: '',
  region: '',
  city: '',
  streets: ['', ''],
  direction: '',
  legalEntity: '',
  size: '',
  format: '',
  lighting: '',
  placement: false,
  price: '',
  dayImage: null,
  schemaImage: null,
};

const LocationForm: React.FC<Props> = ({ onSubmit, isLoading, error, existingLocation = initialState, isEdit }) => {
  const [image, setImage] = useState<{ imageDay: string | null; imageSchema: null | string }>({
    imageDay: null,
    imageSchema: null,
  });
  const [idState, setIdState] = useState({
    city: '',
    area: '',
  });

  const dispatch = useAppDispatch();
  const cities = useAppSelector(selectCityList);
  const streets = useAppSelector(selectStreetList);
  const itemsList = useAppSelector(selectItemsList);
  const [state, setState] = useState<LocationMutation>(existingLocation);

  useEffect(() => {
    if (!isEdit) {
      if (state.area && idState.area !== state.area) {
        dispatch(fetchCities(state.area));
        setIdState((prev) => ({ ...prev, area: state.area }));
        setState((prev) => ({ ...prev, streets: ['', ''], city: '' }));
      }

      if (state.city && idState.city !== state.city) {
        if (cities.find((item) => item._id === state.city)?.name === 'Бишкек') {
          dispatch(fetchRegions(state.city));
          dispatch(fetchStreet({ cityId: state.city }));
        }
        setState((prev) => ({ ...prev, streets: ['', ''] }));
        setIdState((prev) => ({ ...prev, city: state.city }));
      }

      if (state.area === '' && state.city === '') {
        dispatch(getItems());
      }
    }
  }, [dispatch, isEdit, state.area, state.city, idState, cities]);

  const submitFormHandler = async (event: React.FormEvent) => {
    event.preventDefault();
    onSubmit(state);
  };

  const inputChangeHandler = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;

    setState((prevState) => {
      const updatedStreets = [...prevState.streets];

      if (name === 'street1') {
        updatedStreets[0] = value;
      } else if (name === 'street2') {
        updatedStreets[1] = value;
      }

      return { ...prevState, [name]: value, streets: updatedStreets };
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
      <Box
        sx={{
          mt: 6,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Avatar sx={{ m: 1, bgcolor: 'green' }}>
          <AddLocationIcon />
        </Avatar>
        <Typography component="h1" variant="h5" sx={{ mb: 3 }}>
          {isEdit ? 'Редактирование локации' : 'Создание локации'}
        </Typography>
      </Box>
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
            {itemsList.areas &&
              itemsList.areas.map((area) => (
                <MenuItem key={area._id} value={area._id}>
                  {area.name}
                </MenuItem>
              ))}
          </TextField>
        </Grid>
        <Grid sx={{ display: isEdit ? 'block' : idState.area.length > 0 ? 'block' : 'none' }} item>
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
            display: isEdit
              ? 'block'
              : cities.find((item) => item._id === state.city)?.name === 'Бишкек'
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
            {itemsList.regions &&
              itemsList.regions.map((region) => (
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
            value={state.streets[0]}
            name="street1"
            label="Улица"
            onChange={inputChangeHandler}
            required
            error={Boolean(getFieldError('streets'))}
            helperText={getFieldError('streets')}
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
        <Grid sx={style} item>
          <TextField
            fullWidth
            select
            value={state.streets[1]}
            name="street2"
            label="Улица 2"
            onChange={inputChangeHandler}
            required
            error={Boolean(getFieldError('streets'))}
            helperText={getFieldError('streets')}
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
            label="Сторона"
            onChange={inputChangeHandler}
            required
            error={Boolean(getFieldError('direction'))}
            helperText={getFieldError('direction')}
          >
            <MenuItem value="" disabled>
              Выберите направление
            </MenuItem>
            {itemsList.directions &&
              itemsList.directions.map((direction) => (
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
            {itemsList.legalEntity &&
              itemsList.legalEntity.map((legalEnt) => (
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
            {itemsList.sizes &&
              itemsList.sizes.map((size) => (
                <MenuItem key={size._id} value={size._id}>
                  {size.name}
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
            {itemsList.formats &&
              itemsList.formats.map((format) => (
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
            {itemsList.lighting &&
              itemsList.lighting.map((lighting) => (
                <MenuItem key={lighting._id} value={lighting._id}>
                  {lighting.name}
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
            value={existingLocation?.dayImage}
          />
        </Grid>
        <Grid item>
          <FileInput
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => fileInputChangeHandler(e, 'schema')}
            name="schemaImage"
            label="Фото схемы"
            error={Boolean(getFieldError('schemaImage'))}
            value={existingLocation?.schemaImage}
          />
        </Grid>
        {image.imageDay !== null || image.imageSchema !== null ? (
          <Grid display="flex" flexWrap="wrap" justifyContent="space-evenly" item>
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
            color="success"
            variant="contained"
            fullWidth
          >
            {isLoading ? <CircularProgress color="success" /> : isEdit ? 'Редактировать' : 'Создать'}
          </Button>
        </Grid>
      </Grid>
    </>
  );
};

export default LocationForm;

import React from 'react';
import { Box, Card, CardContent, Grid, Switch, Typography } from '@mui/material';
import ShareLocationIcon from '@mui/icons-material/ShareLocation';
import SouthAmericaIcon from '@mui/icons-material/SouthAmerica';
import ApartmentIcon from '@mui/icons-material/Apartment';
import SignpostIcon from '@mui/icons-material/Signpost';
import GpsFixedIcon from '@mui/icons-material/GpsFixed';
import BadgeIcon from '@mui/icons-material/Badge';
import AspectRatioIcon from '@mui/icons-material/AspectRatio';
import FormatAlignCenterIcon from '@mui/icons-material/FormatAlignCenter';
import LightModeIcon from '@mui/icons-material/LightMode';
import LocationCityIcon from '@mui/icons-material/LocationCity';
import LocalOfferIcon from '@mui/icons-material/LocalOffer';
import DateRangeIcon from '@mui/icons-material/DateRange';
import SettingsBackupRestoreIcon from '@mui/icons-material/SettingsBackupRestore';
import { isToggleShow, selectConstructor } from '../commercialLinkSlice';
import { useAppDispatch, useAppSelector } from '../../../app/hooks';

const ConstructorCard = () => {
  const constructorLocation = useAppSelector(selectConstructor);
  const dispatch = useAppDispatch();
  console.log(constructorLocation);
  return (
    <>
      {constructorLocation.map((item) => (
        <Grid key={item.id} item xs>
          <Card elevation={3} sx={{ display: 'flex', alignItems: 'center' }}>
            <Box>
              <CardContent sx={{ flex: '1 0 auto' }}>
                <Typography component="div" variant="h5">
                  {item.name === 'addressNote' && 'Адрес'}
                  {item.name === 'area' && 'Область'}
                  {item.name === 'city' && 'Город'}
                  {item.name === 'region' && 'Район'}
                  {item.name === 'street' && 'Улица'}
                  {item.name === 'direction' && 'Направление'}
                  {item.name === 'legalEntity' && 'Юр.лицо'}
                  {item.name === 'size' && 'Размер'}
                  {item.name === 'format' && 'Формат'}
                  {item.name === 'lighting' && 'Освещение'}
                  {item.name === 'placement' && 'Размещение'}
                  {item.name === 'price' && 'Цена'}
                  {item.name === 'rent' && 'Аренда'}
                  {item.name === 'reserve' && 'Бронь'}
                </Typography>
              </CardContent>
            </Box>
            {item.name === 'addressNote' && <ShareLocationIcon sx={{ fontSize: '50px' }} />}
            {item.name === 'area' && <SouthAmericaIcon sx={{ fontSize: '50px' }} />}
            {item.name === 'city' && <ApartmentIcon sx={{ fontSize: '50px' }} />}
            {item.name === 'region' && <SouthAmericaIcon sx={{ fontSize: '50px' }} />}
            {item.name === 'street' && <SignpostIcon sx={{ fontSize: '50px' }} />}
            {item.name === 'direction' && <GpsFixedIcon sx={{ fontSize: '50px' }} />}
            {item.name === 'legalEntity' && <BadgeIcon sx={{ fontSize: '50px' }} />}
            {item.name === 'size' && <AspectRatioIcon sx={{ fontSize: '50px' }} />}
            {item.name === 'format' && <FormatAlignCenterIcon sx={{ fontSize: '50px' }} />}
            {item.name === 'lighting' && <LightModeIcon sx={{ fontSize: '50px' }} />}
            {item.name === 'placement' && <LocationCityIcon sx={{ fontSize: '50px' }} />}
            {item.name === 'price' && <LocalOfferIcon sx={{ fontSize: '50px' }} />}
            {item.name === 'rent' && <DateRangeIcon sx={{ fontSize: '50px' }} />}
            {item.name === 'reserve' && <SettingsBackupRestoreIcon sx={{ fontSize: '50px' }} />}
            <Switch onClick={() => dispatch(isToggleShow(item.id))} sx={{ marginLeft: 'auto' }} checked={item.show} />
          </Card>
        </Grid>
      ))}
    </>
  );
};

export default ConstructorCard;

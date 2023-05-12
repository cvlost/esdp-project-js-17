import React, { useEffect } from 'react';
import { Box, Chip, CircularProgress, Grid } from '@mui/material';
import { useAppDispatch, useAppSelector } from '../../../app/hooks';
import { selectOneLocation, selectOneLocationLoading } from '../locationsSlice';
import { getOneLocation } from '../locationsThunks';
import { useParams } from 'react-router-dom';
import imagePlaceholder from '../../../assets/billboard-placeholder.jpg';
import LocationPageTabs from './LocationPageTabs';
import { apiURL } from '../../../constants';

const LocationPage = () => {
  const dispatch = useAppDispatch();
  const id = useParams().id as string;
  const loc = useAppSelector(selectOneLocation);
  const locLoading = useAppSelector(selectOneLocationLoading);

  useEffect(() => {
    if (id) {
      dispatch(getOneLocation(id));
    }
  }, [dispatch, id]);

  return (
    <Box sx={{ py: 2 }}>
      {locLoading ? (
        <CircularProgress />
      ) : (
        <>
          <Chip
            sx={{ fontSize: '20px', p: 3, mb: 2 }}
            label={`Локация ${loc?.city} ${loc?.street}, ${loc?.direction}`}
            variant="outlined"
            color="info"
          />
          <Grid container spacing={1}>
            <Grid item xs={12} md={6}>
              <Box sx={{ position: 'sticky', top: '1em' }}>
                <img
                  alt={`Локация ${loc?.city} ${loc?.street}, ${loc?.direction}`}
                  src={loc?.dayImage ? `${apiURL}/images/day/${loc.dayImage}` : imagePlaceholder}
                  style={{
                    maxWidth: '100%',
                    boxShadow: '0 0 15px gainsboro',
                  }}
                />
              </Box>
              <Box sx={{ position: 'sticky', top: '1em' }}>
                <img
                  alt={`Локация ${loc?.city} ${loc?.street}, ${loc?.direction}`}
                  src={loc?.dayImage ? `${apiURL}/images/schema/${loc.schemaImage}` : imagePlaceholder}
                  style={{
                    maxWidth: '100%',
                    boxShadow: '0 0 15px gainsboro',
                  }}
                />
              </Box>
            </Grid>
            <Grid item xs={12} md={6}>
              <Box>
                <LocationPageTabs />
              </Box>
            </Grid>
          </Grid>
        </>
      )}
    </Box>
  );
};

export default LocationPage;

import React, { useEffect, useState } from 'react';
import { Alert, Box, Chip, CircularProgress, Container, Grid, Pagination, Paper } from '@mui/material';
import { ARR, MainColorGreen } from '../../../constants';
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';
import Tab from '@mui/material/Tab';
import { useAppDispatch, useAppSelector } from '../../../app/hooks';
import {
  selectLocationsFilter,
  selectLocationsListData,
  selectLocationsListLoading,
  setCurrentPage,
} from '../locationsSlice';
import { getLocationsList } from '../locationsThunks';
import dayjs from 'dayjs';
import ru from 'dayjs/locale/ru';
import ModalBody from '../../../components/ModalBody';
import LocationFilter from '../components/LocationsFilter';
import PanelMenu from './compnents/PanelMenu';
import LocationCardGrap from './compnents/LocationCardGrap';
import PanelAccounts from './compnents/PanelAccounts';

const LocationGraphic = () => {
  const [pullingMonth, setPullingMonth] = useState(ARR[0]);
  const dispatch = useAppDispatch();
  const locationsListData = useAppSelector(selectLocationsListData);
  const filter = useAppSelector(selectLocationsFilter);
  const [value, setValue] = useState(
    (ARR.findIndex((item) => item === dayjs().locale(ru).format('MMMM')) + 1).toString(),
  );
  const [filterYear, setFilterYear] = useState(dayjs().year().toString());
  const locationsListLoading = useAppSelector(selectLocationsListLoading);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const locationLoading = useAppSelector(selectLocationsListLoading);

  useEffect(() => {
    dispatch(
      getLocationsList({
        page: locationsListData.page,
        perPage: locationsListData.perPage,
        filterYear: parseInt(filterYear),
        filtered: filter.filtered,
      }),
    );
  }, [dispatch, filter.filtered, locationsListData.page, locationsListData.perPage, filterYear]);

  const handleChange = (event: React.SyntheticEvent, newValue: string) => {
    setValue(newValue);
  };

  return (
    <Box sx={{ py: 2 }}>
      <Container>
        <Grid container>
          <Grid sx={{ display: 'flex' }} xs={12} item>
            <Chip
              sx={{ fontSize: '20px', p: 3, color: MainColorGreen, mb: 2 }}
              label={`Графическое представление`}
              variant="outlined"
              color="success"
            />
          </Grid>

          <Grid xs={12} item>
            <Box sx={{ display: 'flex', mb: 1 }}>
              <PanelMenu
                filterYear={filterYear}
                setFilterYear={(e: React.ChangeEvent<HTMLInputElement>) => setFilterYear(e.target.value)}
                setIsFilterOpen={() => setIsFilterOpen((prev) => !prev)}
              />
            </Box>
            <Paper elevation={3} sx={{ width: '100%', minHeight: '600px', overflowX: 'hidden' }}>
              <TabContext value={value}>
                <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                  <TabList onChange={handleChange} aria-label="lab API tabs example">
                    {ARR.map((month, index) => (
                      <Tab
                        onClick={() => setPullingMonth(ARR[index])}
                        key={month}
                        label={`${month}, ${filterYear}`}
                        value={(index + 1).toString()}
                      />
                    ))}
                  </TabList>
                </Box>
                {ARR.map((month, index) => (
                  <TabPanel key={index} value={(index + 1).toString()}>
                    <Grid sx={{ p: 1 }} container spacing={3}>
                      {locationsListData.locations.length !== 0 ? (
                        !locationLoading ? (
                          locationsListData.locations.map((loc, index) => (
                            <LocationCardGrap key={loc._id} loc={loc} month={month} index={index} />
                          ))
                        ) : (
                          <CircularProgress />
                        )
                      ) : (
                        <Alert severity="info">Список локаций пуст</Alert>
                      )}
                    </Grid>
                  </TabPanel>
                ))}
              </TabContext>
            </Paper>
          </Grid>
          <Grid sx={{ mt: 2 }} xs={3} item>
            <PanelAccounts pullingMonth={pullingMonth} />
          </Grid>
          <Grid xs={12} item>
            <Pagination
              size="small"
              sx={{ display: 'flex', justifyContent: 'center', mt: '20px' }}
              disabled={locationsListLoading}
              count={locationsListData.pages}
              page={locationsListData.page}
              onChange={(event, page) => dispatch(setCurrentPage(page))}
            />
          </Grid>
        </Grid>
      </Container>
      <ModalBody isOpen={isFilterOpen} onClose={() => setIsFilterOpen(false)}>
        <LocationFilter onClose={() => setIsFilterOpen(false)} />
      </ModalBody>
    </Box>
  );
};

export default LocationGraphic;

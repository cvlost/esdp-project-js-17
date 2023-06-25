import React, { useEffect, useState } from 'react';
import {
  Alert,
  Box,
  Button,
  Chip,
  CircularProgress,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  Pagination,
  Paper,
  Typography,
} from '@mui/material';
import { ARR, MainColorGreen } from '../../../constants';
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';
import Tab from '@mui/material/Tab';
import { useAppDispatch, useAppSelector } from '../../../app/hooks';
import dayjs from 'dayjs';
import ru from 'dayjs/locale/ru';
import PanelMenu from './compnents/PanelMenu';
import PanelAccounts from './compnents/PanelAccounts';
import { fetchLocationGraphic } from './locationGraphicThunk';
import { selectLocationGraphicFetch, selectLocationGraphicList, setCurrentPage } from './locationGraphicSlice';
import LocationCardGrap from './compnents/LocationCardGrap';
import BarChart from '../../../components/BarChart/BarChart';
import { IData } from '../../../types';

const LocationGraphic = () => {
  const [pullingMonth, setPullingMonth] = useState(
    ARR[ARR.findIndex((item) => item === dayjs().locale(ru).format('MMMM'))],
  );
  const [value, setValue] = useState(
    (ARR.findIndex((item) => item === dayjs().locale(ru).format('MMMM')) + 1).toString(),
  );
  const [openBar, setOpenBar] = useState(false);
  const [filterYear, setFilterYear] = useState(dayjs().year().toString());

  const dispatch = useAppDispatch();
  const locationGraphicList = useAppSelector(selectLocationGraphicList);
  const locationGraphicLoading = useAppSelector(selectLocationGraphicFetch);

  useEffect(() => {
    dispatch(
      fetchLocationGraphic({
        page: locationGraphicList.page,
        perPage: locationGraphicList.perPage,
        filterYear: parseInt(filterYear),
        filterMonth: pullingMonth,
      }),
    );
  }, [dispatch, locationGraphicList.page, locationGraphicList.perPage, pullingMonth, filterYear]);

  const handleChange = (event: React.SyntheticEvent, newValue: string) => {
    setValue(newValue);
  };

  const BAR_CHART_DATA: IData[] = locationGraphicList.locations.map((item, index) => {
    return {
      label: (index + 1).toString(),
      value: item.booking.length,
      tooltip: item.booking,
      comp: item.booking.map((book) => (
        <Box key={item._id}>
          <Typography sx={{ color: '#fff', display: 'block', my: 1 }} component="span" color="inherit">
            {`Занятость от ${dayjs(book.booking_date.start).format('DD.MM.YYYY')} до ${dayjs(
              book.booking_date.end,
            ).format('DD.MM.YYYY')}`}
          </Typography>
          <Typography sx={{ color: '#fff', display: 'block' }} component="span" color="inherit">
            Клиент: {book.clientId}
          </Typography>
        </Box>
      )),
    };
  });

  return (
    <Box sx={{ py: 2 }}>
      <Container>
        <Grid container>
          <Grid sx={{ display: 'flex' }} xs={12} item>
            <Chip
              sx={{ fontSize: '20px', p: 3, color: MainColorGreen, mb: 2 }}
              label={`Календарный список`}
              variant="outlined"
              color="success"
            />
          </Grid>

          <Grid xs={12} item>
            <Box sx={{ display: 'flex', mb: 1 }}>
              <PanelMenu
                filterYear={filterYear}
                setOpenBar={() => setOpenBar(true)}
                setFilterYear={(e: React.ChangeEvent<HTMLInputElement>) => setFilterYear(e.target.value)}
              />
            </Box>
            <Paper elevation={3} sx={{ width: '100%', minHeight: '600px', overflowX: 'hidden' }}>
              <TabContext value={value}>
                <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                  <TabList onChange={handleChange} aria-label="lab API tabs example" variant="scrollable">
                    {ARR.map((month, index) => (
                      <Tab
                        onClick={() => setPullingMonth(ARR[index])}
                        key={month}
                        label={`${month}, 2023`}
                        value={(index + 1).toString()}
                      />
                    ))}
                  </TabList>
                </Box>
                {ARR.map((month, index) => (
                  <TabPanel key={index} value={(index + 1).toString()}>
                    <Grid sx={{ p: 1 }} container spacing={3} columns={{ xs: 4, sm: 8, md: 12 }}>
                      {locationGraphicList.locations.length !== 0 ? (
                        !locationGraphicLoading ? (
                          locationGraphicList.locations.map((loc, index) => (
                            <LocationCardGrap key={loc._id} loc={loc} month={month} index={index} />
                          ))
                        ) : (
                          <CircularProgress />
                        )
                      ) : (
                        <Alert severity="info">В данный момент локаций нет</Alert>
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
              disabled={locationGraphicLoading}
              count={locationGraphicList.pages}
              page={locationGraphicList.page}
              onChange={(event, page) => dispatch(setCurrentPage(page))}
            />
          </Grid>
        </Grid>
      </Container>
      <Dialog
        open={openBar}
        onClose={() => setOpenBar(false)}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">Бронь</DialogTitle>
        <DialogContent>
          <BarChart data={BAR_CHART_DATA} />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenBar(false)}>Закрыть</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default LocationGraphic;

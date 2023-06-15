import React, { useEffect, useState } from 'react';
import {
  Box,
  Chip,
  Grid,
  Table,
  TableHead,
  TableRow,
  TableBody,
  Paper,
  TableContainer,
  Container,
  Alert,
  Pagination,
  Button,
  IconButton,
} from '@mui/material';
import { MainColorGreen } from '../../../constants';
import { getLocationsList } from '../locationsThunks';
import { useAppDispatch, useAppSelector } from '../../../app/hooks';
import {
  resetFilter,
  selectLocationsFilter,
  selectLocationsListData,
  selectLocationsListLoading,
  setCurrentPage,
} from '../locationsSlice';
import ModalBody from '../../../components/ModalBody';
import dayjs from 'dayjs';
import ru from 'dayjs/locale/ru';
import { StyledTableCell } from '../../../constants';
import CardAnalytics from './components/CardAnalytics';
import { ClientHistoryOneType, ClientsHistoryType, DateHistoryClient } from '../../../types';
import ModalListDate from './components/ModalListDate';
import CardListClients from './components/CardListClients';
import TuneIcon from '@mui/icons-material/Tune';
import LocationFilter from '../components/LocationsFilter';

const Analytics = () => {
  const dispatch = useAppDispatch();
  const locationsListData = useAppSelector(selectLocationsListData);
  const filter = useAppSelector(selectLocationsFilter);
  const [openOrder, setOpenOrder] = useState(false);
  const [openDate, setOpenDate] = useState(false);
  const [id, setId] = useState('');
  const [clientHistoryOne, setClientHistoryOne] = useState<ClientHistoryOneType>({
    coll: [],
    start: {
      month: '',
      day: 0,
      date: '',
    },
    end: {
      month: '',
      day: 0,
      date: '',
    },
    monthNames: [],
  });
  const locationsListLoading = useAppSelector(selectLocationsListLoading);
  const locationOne = locationsListData.locations.find((item) => item._id === id);
  const clientsHistory: ClientsHistoryType[] = [];
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  useEffect(() => {
    dispatch(
      getLocationsList({
        page: locationsListData.page,
        perPage: locationsListData.perPage,
        filtered: filter.filtered,
      }),
    );
  }, [dispatch, filter.filtered, locationsListData.page, locationsListData.perPage]);

  const openModalOrder = (id: string) => {
    setId(id);
    setOpenOrder(true);
  };

  const openModalDate = (clientHistoryOne: DateHistoryClient) => {
    setClientHistoryOne(clientHistoryOne);
    setOpenDate(true);
  };

  if (locationOne) {
    locationOne.analytics.forEach((item) => {
      const monthNames: string[] = [];
      const months = dayjs(item.rent_date.end).diff(dayjs(item.rent_date.start), 'month');
      let currentMonth = dayjs(item.rent_date.start);

      for (let i = 0; i <= months; i++) {
        monthNames.push(currentMonth.locale(ru).format('MMMM'));
        currentMonth = currentMonth.add(1, 'month');
      }

      const obj = {
        id: item._id,
        start: {
          month: dayjs(item.rent_date.start).locale(ru).format('MMMM'),
          day: dayjs(item.rent_date.start).date(),
          date: item.rent_date.start,
        },
        end: {
          month: dayjs(item.rent_date.end).locale(ru).format('MMMM'),
          day: dayjs(item.rent_date.end).date(),
          date: item.rent_date.end,
        },
        number: [...Array(31)].map((_, index) => index + 1),
        client: item.client[0].companyName,
        year: dayjs(item.rent_date.start).year(),
        monthNames: monthNames.slice(1, -1),
      };

      clientsHistory.push(obj);
    });
  }

  return (
    <Box sx={{ py: 2 }}>
      <Container>
        <Grid container alignItems="center" mb={2}>
          <Grid item>
            <Chip
              sx={{ fontSize: '20px', p: 3, color: MainColorGreen }}
              label="Аналитика"
              variant="outlined"
              color="success"
            />
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
        </Grid>
        <Paper elevation={3} sx={{ width: '100%', minHeight: '600px', overflowX: 'hidden' }}>
          <TableContainer>
            <Table sx={{ minWidth: 650 }} aria-label="simple table">
              <TableHead>
                <TableRow>
                  <StyledTableCell>Локация</StyledTableCell>
                  <StyledTableCell align="center">Итог цена сом</StyledTableCell>
                  <StyledTableCell align="center">Итог факт сом</StyledTableCell>
                  <StyledTableCell align="center">Размер скидки</StyledTableCell>
                  <StyledTableCell align="center">Колл.. заказчиков</StyledTableCell>
                  <StyledTableCell align="center">Заказы</StyledTableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {locationsListData.locations.map((item) => (
                  <CardAnalytics key={item._id} loc={item} openModalOrder={() => openModalOrder(item._id)} />
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
      </Container>
      <ModalBody isOpen={openOrder} onClose={() => setOpenOrder(false)}>
        <Grid container>
          <Grid item>
            <Chip
              sx={{ fontSize: '20px', p: 3, color: MainColorGreen, mb: 2 }}
              label="Заказчики"
              variant="outlined"
              color="success"
            />
          </Grid>
        </Grid>
        {clientsHistory.length !== 0 ? (
          clientsHistory.map((history) => (
            <Paper
              onClick={() =>
                openModalDate({
                  coll: history.number,
                  start: history.start,
                  end: history.end,
                  monthNames: history.monthNames,
                })
              }
              elevation={3}
              sx={{ p: 2, display: 'flex', alignItems: 'center', mb: 1, cursor: 'pointer' }}
              key={history.id}
            >
              <CardListClients history={history} />
            </Paper>
          ))
        ) : (
          <Alert severity="info">Список заказов пуст !</Alert>
        )}
      </ModalBody>
      <ModalListDate
        open={openDate}
        setOpenDate={() => openModalDate(clientHistoryOne)}
        setCloseDate={() => setOpenDate(false)}
        clientHistoryOne={clientHistoryOne}
      />
      <ModalBody isOpen={isFilterOpen} onClose={() => setIsFilterOpen(false)}>
        <LocationFilter onClose={() => setIsFilterOpen(false)} />
      </ModalBody>
    </Box>
  );
};

export default Analytics;

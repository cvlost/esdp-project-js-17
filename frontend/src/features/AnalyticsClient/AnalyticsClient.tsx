import React, { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { selectAnalyticsClientFetch, selectAnalyticsClientList, setCurrentPage } from './AnalyticsClientSlice';
import {
  Alert,
  Box,
  CircularProgress,
  Pagination,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Tooltip,
} from '@mui/material';
import { ARR, StyledTableCell } from '../../constants';
import { fetchAnalyticClientList } from './AnalyticsClientThunk';
import dayjs from 'dayjs';
import AnalyticsClientCard from './components/AnalyticsClientCard';
import ControlPanel from './components/ControlPanel';

const AnalyticsClient = () => {
  const [filterYearValue, setFilterYearValue] = useState<string>(dayjs().year().toString());
  const dispatch = useAppDispatch();
  const analyticsClientList = useAppSelector(selectAnalyticsClientList);
  const [filterDate, setFilterDate] = useState(false);
  const loading = useAppSelector(selectAnalyticsClientFetch);

  useEffect(() => {
    dispatch(
      fetchAnalyticClientList({
        page: analyticsClientList.page,
        perPage: analyticsClientList.perPage,
        filter: parseInt(filterYearValue),
        constantClient: filterDate,
      }),
    );
  }, [dispatch, analyticsClientList.page, analyticsClientList.perPage, filterYearValue, filterDate]);

  const totalBudgetPerMonth = (month: string) => {
    const total = analyticsClientList.clintAnalNew
      .map((item) => {
        return item.anal.filter((item) => item.month === month).map((anal) => anal.total);
      })
      .flat(1);

    return total.reduce((acc, value) => acc + parseInt(value), 0);
  };

  const generalBudget = () => {
    return analyticsClientList.clintAnalNew.reduce((acc, value) => acc + value.overallBudget, 0);
  };

  const totalNumberOfRentalDays = () => {
    return analyticsClientList.clintAnalNew.reduce((acc, value) => acc + value.rentDay, 0);
  };

  const generalNumberOfBanners = () => {
    return analyticsClientList.clintAnalNew.reduce((acc, value) => acc + value.numberOfBanners, 0);
  };

  return (
    <Box sx={{ py: 2 }}>
      <ControlPanel
        filterYearValue={filterYearValue}
        setFilterYearValue={(e: React.ChangeEvent<HTMLInputElement>) => setFilterYearValue(e.target.value)}
        setFilterDate={() => setFilterDate((prev) => !prev)}
      />
      <Paper elevation={3} sx={{ width: '100%', minHeight: '600px', overflowX: 'hidden' }}>
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead>
            <TableRow>
              <StyledTableCell>Клиенты</StyledTableCell>
              {ARR.map((month) => (
                <StyledTableCell key={month} align="center">
                  <Tooltip placement="top" title={<p>{totalBudgetPerMonth(month)}</p>}>
                    <p style={{ cursor: 'pointer' }}>{month}</p>
                  </Tooltip>
                </StyledTableCell>
              ))}
              <StyledTableCell align="center">
                <Tooltip placement="top" title={<p>{generalBudget()}</p>}>
                  <p style={{ cursor: 'pointer' }}>Общий бюджет</p>
                </Tooltip>
              </StyledTableCell>
              <StyledTableCell align="center">
                <Tooltip placement="top" title={<p>{totalNumberOfRentalDays()}</p>}>
                  <p style={{ cursor: 'pointer' }}>Дни аредны</p>
                </Tooltip>
              </StyledTableCell>
              <StyledTableCell align="center">
                <Tooltip placement="top" title={<p>{generalNumberOfBanners()}</p>}>
                  <p style={{ cursor: 'pointer' }}>Колличество баннеров</p>
                </Tooltip>
              </StyledTableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {analyticsClientList.clintAnalNew.length !== 0 ? (
              !loading ? (
                analyticsClientList.clintAnalNew.map((client) => (
                  <AnalyticsClientCard key={client.client._id} client={client} />
                ))
              ) : (
                <TableRow>
                  <TableCell>
                    <CircularProgress />
                  </TableCell>
                </TableRow>
              )
            ) : (
              <TableRow>
                <TableCell>
                  <Alert severity="info">Список аналитики пуст</Alert>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </Paper>
      <Pagination
        disabled={loading}
        size="small"
        sx={{ display: 'flex', justifyContent: 'center', mt: '20px' }}
        count={analyticsClientList.pages}
        page={analyticsClientList.page}
        onChange={(event, page) => dispatch(setCurrentPage(page))}
      />
    </Box>
  );
};

export default AnalyticsClient;

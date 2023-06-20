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
} from '@mui/material';
import { fetchAnalyticClientList } from './AnalyticsClientThunk';
import dayjs from 'dayjs';
import AnalyticsClientCard from './components/AnalyticsClientCard';
import ControlPanel from './components/ControlPanel';
import AnalyticsClientMenuList from './components/AnalyticsClientMenuList';

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
              <AnalyticsClientMenuList />
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

import React, { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import {
  Alert,
  Box,
  CircularProgress,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@mui/material';
import dayjs from 'dayjs';
import { fetchAnalyticLocList } from './LocationAnalyticsThunk';
import { selectAnalyticsLocationsFetch, selectAnalyticsLocationsList } from './LocationAnalyticsSlice';
import ControlPanelLocAn from './components/ControlPanelLocAn';
import AnalyticsLocationsCard from './components/LocationAnalyticsCard';
import AnalyticsLocMenuList from './components/AnalyticsLocMenuList';

const AnalyticsClient = () => {
  const [filterYearValue, setFilterYearValue] = useState<string>(dayjs().year().toString());
  const dispatch = useAppDispatch();
  const loading = useAppSelector(selectAnalyticsLocationsFetch);
  const locationsData = useAppSelector(selectAnalyticsLocationsList);

  useEffect(() => {
    dispatch(
      fetchAnalyticLocList({
        filter: parseInt(filterYearValue),
      }),
    );
  }, [dispatch, filterYearValue]);

  return (
    <Box sx={{ py: 2 }}>
      <ControlPanelLocAn
        filterYearValue={filterYearValue}
        setFilterYearValue={(e: React.ChangeEvent<HTMLInputElement>) => setFilterYearValue(e.target.value)}
      />
      <Paper elevation={3} sx={{ width: '100%', minHeight: '600px', overflowX: 'hidden' }}>
        <TableContainer>
          <Table sx={{ minWidth: 650 }} aria-label="simple table">
            <TableHead>
              <TableRow>
                <AnalyticsLocMenuList />
              </TableRow>
            </TableHead>
            <TableBody>
              {locationsData.locationsAnalytics.length !== 0 ? (
                !loading ? (
                  locationsData.locationsAnalytics.map((loc) => <AnalyticsLocationsCard location={loc} key={loc._id} />)
                ) : (
                  <TableRow>
                    <TableCell>
                      <CircularProgress color="success" />
                    </TableCell>
                  </TableRow>
                )
              ) : (
                <TableRow>
                  <TableCell>
                    <Alert severity="info">Список аналитики локаций пуст</Alert>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </Box>
  );
};

export default AnalyticsClient;

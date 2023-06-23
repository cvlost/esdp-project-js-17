import React, { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { selectAnalyticsClientFetch, selectAnalyticsClientList, setCurrentPage } from './AnalyticsClientSlice';
import {
  Alert,
  Box,
  CircularProgress,
  DialogTitle,
  Pagination,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Dialog,
  DialogContent,
  DialogActions,
  Button,
  Typography,
} from '@mui/material';
import { fetchAnalyticClientList } from './AnalyticsClientThunk';
import dayjs from 'dayjs';
import AnalyticsClientCard from './components/AnalyticsClientCard';
import ControlPanel from './components/ControlPanel';
import AnalyticsClientMenuList from './components/AnalyticsClientMenuList';
import BarChart from '../../components/BarChart/BarChart';
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';
import Tab from '@mui/material/Tab';
import { IData } from '../../types';

const AnalyticsClient = () => {
  const [filterYearValue, setFilterYearValue] = useState<string>(dayjs().year().toString());
  const dispatch = useAppDispatch();
  const analyticsClientList = useAppSelector(selectAnalyticsClientList);
  const [filterDate, setFilterDate] = useState(false);
  const loading = useAppSelector(selectAnalyticsClientFetch);
  const [open, setOpen] = useState(false);
  const [value, setValue] = React.useState('1');

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

  const handleChange = (event: React.SyntheticEvent, newValue: string) => {
    setValue(newValue);
  };

  const barChartData_banners: IData[] = analyticsClientList.clintAnalNew.map((item) => {
    return {
      label: item.client.companyName,
      value: item.numberOfBanners,
      tooltip: item.anal,
      comp: (
        <Box key={item._id}>
          <Typography sx={{ color: '#fff', display: 'block' }} component="span" color="inherit">
            Клиент: {item.client.companyName}
          </Typography>
          <Typography sx={{ color: '#fff', display: 'block' }} component="span" color="inherit">
            Баннеры: {item.numberOfBanners}
          </Typography>
        </Box>
      ),
    };
  });

  const barChartData_budget: IData[] = analyticsClientList.clintAnalNew.map((item) => {
    return {
      label: item.client.companyName,
      value: item.overallBudget,
      tooltip: item.anal,
      comp: (
        <Box key={item._id}>
          <Typography sx={{ color: '#fff', display: 'block' }} component="span" color="inherit">
            Клиент: {item.client.companyName}
          </Typography>
          <Typography sx={{ color: '#fff', display: 'block' }} component="span" color="inherit">
            Бюджет: {item.overallBudget}
          </Typography>
        </Box>
      ),
    };
  });

  const barChartData_date: IData[] = analyticsClientList.clintAnalNew.map((item) => {
    return {
      label: item.client.companyName,
      value: item.rentDay,
      tooltip: item.anal,
      comp: (
        <Box key={item._id}>
          <Typography sx={{ color: '#fff', display: 'block' }} component="span" color="inherit">
            Клиент: {item.client.companyName}
          </Typography>
          <Typography sx={{ color: '#fff', display: 'block' }} component="span" color="inherit">
            Дни аренды: {item.rentDay}
          </Typography>
        </Box>
      ),
    };
  });

  return (
    <Box sx={{ py: 2 }}>
      <ControlPanel
        setOpen={() => setOpen(true)}
        filterYearValue={filterYearValue}
        setFilterYearValue={(e: React.ChangeEvent<HTMLInputElement>) => setFilterYearValue(e.target.value)}
        setFilterDate={() => setFilterDate((prev) => !prev)}
      />
      <Paper elevation={3} sx={{ width: '100%', minHeight: '600px', overflowX: 'hidden' }}>
        <TableContainer>
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
        </TableContainer>
      </Paper>
      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">Аналитика</DialogTitle>
        <DialogContent>
          <TabContext value={value}>
            <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
              <TabList onChange={handleChange} aria-label="lab API tabs example" variant="scrollable">
                <Tab label="Аналитика по бюджету" value="1" />
                <Tab label="Аналитика по дням аренды" value="2" />
                <Tab label="Аналитика по баннерам" value="3" />
              </TabList>
            </Box>
            <TabPanel value="1">
              <BarChart data={barChartData_budget} />
            </TabPanel>
            <TabPanel value="2">
              <BarChart data={barChartData_date} />
            </TabPanel>
            <TabPanel value="3">
              <BarChart data={barChartData_banners} />
            </TabPanel>
          </TabContext>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)}>Закрыть</Button>
        </DialogActions>
      </Dialog>
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

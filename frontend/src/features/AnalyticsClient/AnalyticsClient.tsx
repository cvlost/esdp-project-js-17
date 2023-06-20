import React, { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { selectAnalyticsClientList, setCurrentPage } from './AnalyticsClientSlice';
import {
  Box,
  Checkbox,
  Chip,
  FormControlLabel,
  FormGroup,
  Grid,
  MenuItem,
  Pagination,
  Paper,
  Table,
  TableBody,
  TableHead,
  TableRow,
  TextField,
  Tooltip,
} from '@mui/material';
import { ARR, MainColorGreen, StyledTableCell, YEAR } from '../../constants';
import { fetchAnalyticClientList } from './AnalyticsClientThunk';
import dayjs from 'dayjs';
import AnalyticsClientCard from './components/AnalyticsClientCard';

const AnalyticsClient = () => {
  const [filterYearValue, setFilterYearValue] = useState<string>(dayjs().year().toString());
  const dispatch = useAppDispatch();
  const analyticsClientList = useAppSelector(selectAnalyticsClientList);
  const [filterDate, setFilterDate] = useState(false);

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
      <Grid container alignItems="center" mb={2}>
        <Grid item>
          <Chip
            sx={{ fontSize: '20px', p: 3, color: MainColorGreen }}
            label={`Аналитика клиентов за ${filterYearValue} год`}
            variant="outlined"
            color="success"
          />
        </Grid>
        <Grid item>
          <TextField
            select
            value={filterYearValue}
            name="filterYear"
            label="Выбор года"
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFilterYearValue(e.target.value)}
            sx={{ width: '300px', ml: 1 }}
          >
            <MenuItem value="" disabled>
              Выберите год
            </MenuItem>
            {YEAR.map((year) => (
              <MenuItem key={year} value={year}>
                {year}
              </MenuItem>
            ))}
          </TextField>
        </Grid>
        <Grid sx={{ ml: 1 }} item>
          <FormGroup aria-label="position" row>
            <FormControlLabel
              value="end"
              control={<Checkbox onClick={() => setFilterDate((prev) => !prev)} />}
              label="Популярный клиент"
              labelPlacement="end"
            />
          </FormGroup>
        </Grid>
      </Grid>
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
            {analyticsClientList.clintAnalNew.map((client) => (
              <AnalyticsClientCard key={client._id} client={client} />
            ))}
          </TableBody>
        </Table>
      </Paper>
      <Pagination
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

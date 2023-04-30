import React, { useEffect } from 'react';
import {
  Box,
  Chip,
  Grid,
  Pagination,
  Paper,
  Table,
  TableBody,
  TableContainer,
  TableHead,
  TableRow,
} from '@mui/material';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import {
  selectLocationsListData,
  selectLocationsListLoading,
  setCurrentPage,
} from '../../features/location/locationsSlice';
import { StyledTableCell } from '../../constants';
import { getLocationsList } from '../../features/location/locationsThunks';
import HomeItem from './HomeItem';

const HomeList = () => {
  const dispatch = useAppDispatch();
  const locationsListData = useAppSelector(selectLocationsListData);
  const locationsListLoading = useAppSelector(selectLocationsListLoading);
  useEffect(() => {
    dispatch(getLocationsList({ page: locationsListData.page, perPage: locationsListData.perPage }));
  }, [dispatch, locationsListData.page, locationsListData.perPage]);
  return (
    <Box sx={{ py: 2 }}>
      <Grid container alignItems="center" mb={2}>
        <Grid item>
          <Chip
            sx={{ fontSize: '20px', p: 3 }}
            label={`Список баннеров: ${locationsListData.count}`}
            variant="outlined"
            color="info"
          />
        </Grid>
      </Grid>
      <Paper elevation={3} sx={{ width: '100%', minHeight: '600px', overflowX: 'hidden' }}>
        <TableContainer>
          <Table sx={{ minWidth: 650 }}>
            <TableHead>
              <TableRow>
                <StyledTableCell align="right">№</StyledTableCell>
                <StyledTableCell align="center">Фото</StyledTableCell>
                <StyledTableCell align="center">Локация</StyledTableCell>
                <StyledTableCell align="center">Район</StyledTableCell>
                <StyledTableCell align="center">Размер</StyledTableCell>
                <StyledTableCell align="center">Освещение</StyledTableCell>
                <StyledTableCell align="right">Условия аренды</StyledTableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {locationsListData.locations.map((loc, i) => (
                <HomeItem
                  key={loc._id}
                  loc={loc}
                  number={(locationsListData.page - 1) * locationsListData.perPage + i + 1}
                />
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
    </Box>
  );
};

export default HomeList;

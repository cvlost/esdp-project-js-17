import React, { useEffect, useState } from 'react';
import { Box, Chip, Pagination, Paper, Table, TableBody, TableContainer, TableHead } from '@mui/material';
import { styled, TableCell, tableCellClasses, TableRow } from '@mui/material';
import ModalBody from '../../components/ModalBody';
import CardLocation from './components/CardLocation';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { selectLocationsListData, selectLocationsListLoading, setCurrentPage } from './locationsSlice';
import { getLocationsList } from './locationsThunks';

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: '#ff5722',
    color: theme.palette.common.white,
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
  },
}));

const LocationList = () => {
  const dispatch = useAppDispatch();
  const locationsListData = useAppSelector(selectLocationsListData);
  const locationsListLoading = useAppSelector(selectLocationsListLoading);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    dispatch(getLocationsList({ page: locationsListData.page, perPage: locationsListData.perPage }));
  }, [dispatch, locationsListData.page, locationsListData.perPage]);

  return (
    <Box sx={{ py: 2 }}>
      <Chip
        sx={{ mb: 2, fontSize: '20px', p: 3 }}
        label={`Список локаций: ${locationsListData.count}`}
        variant="outlined"
        color="info"
      />

      <Paper elevation={3} sx={{ width: '100%', minHeight: '600px', overflowX: 'hidden' }}>
        <TableContainer>
          <Table sx={{ minWidth: 650 }} aria-label="simple table">
            <TableHead>
              <TableRow>
                <StyledTableCell align="left">Полный адрес</StyledTableCell>
                <StyledTableCell align="center">Город</StyledTableCell>
                <StyledTableCell align="center">Район</StyledTableCell>
                <StyledTableCell align="center">Направление</StyledTableCell>
                <StyledTableCell align="right">Управление</StyledTableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {locationsListData.locations.map((loc) => (
                <CardLocation key={loc._id} loc={loc} onClose={() => setIsOpen(true)} />
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
      <ModalBody isOpen={isOpen} onClose={() => setIsOpen(false)}>
        Редактировать
      </ModalBody>
    </Box>
  );
};

export default LocationList;

import React, { useState } from 'react';
import { Box, Chip, Paper, Table, TableBody, TableContainer, TableHead } from '@mui/material';
import { styled, TableCell, tableCellClasses, TableRow } from '@mui/material';
import ModalBody from '../../components/ModalBody';
import CardLocation from './components/CardLocation';

const LocationList = () => {
  const [isOpen, setIsOpen] = useState(false);
  const StyledTableCell = styled(TableCell)(({ theme }) => ({
    [`&.${tableCellClasses.head}`]: {
      backgroundColor: '#ff5722',
      color: theme.palette.common.white,
    },
    [`&.${tableCellClasses.body}`]: {
      fontSize: 14,
    },
  }));

  return (
    <Box sx={{ py: 2 }}>
      <Chip sx={{ mb: 2, fontSize: '20px', p: 3 }} label={'Список локаций: ' + 0} variant="outlined" color="info" />

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
              <CardLocation onClose={() => setIsOpen(true)} />
              <CardLocation onClose={() => setIsOpen(true)} />
              <CardLocation onClose={() => setIsOpen(true)} />
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
      <ModalBody isOpen={isOpen} onClose={() => setIsOpen(false)}>
        Редактировать
      </ModalBody>
    </Box>
  );
};

export default LocationList;

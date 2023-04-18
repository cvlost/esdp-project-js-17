import React, { useState } from 'react';
import { Box, Button, ButtonGroup, Chip, Paper, Table, TableBody, TableContainer, TableHead } from '@mui/material';
import { styled, TableCell, tableCellClasses, TableRow } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import ModalBody from '../../components/ModalBody';

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

  const StyledTableRow = styled(TableRow)(({ theme }) => ({
    '&:nth-of-type(odd)': {
      backgroundColor: '#e3f2fd',
    },
    // hide last border
    '&:last-child td, &:last-child th': {
      border: 0,
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
              <StyledTableRow sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                <TableCell align="left">Бишкек/улица-толстова/юг</TableCell>
                <TableCell align="center">Бишкек</TableCell>
                <TableCell align="center">Ленинский</TableCell>
                <TableCell align="center">Юг</TableCell>
                <TableCell align="right">
                  <ButtonGroup variant="contained" aria-label="outlined primary button group">
                    <Button size="small" color="error">
                      <DeleteIcon />
                    </Button>
                    <Button size="small" color="success" onClick={() => setIsOpen(true)}>
                      <EditIcon />
                    </Button>
                  </ButtonGroup>
                </TableCell>
              </StyledTableRow>
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

import React from 'react';
import { Box, ButtonGroup, IconButton, Table, TableBody, TableCell, TableHead, TableRow } from '@mui/material';
import RemoveCircleIcon from '@mui/icons-material/RemoveCircle';
import { Link } from 'react-router-dom';
import LaunchIcon from '@mui/icons-material/Launch';

const BookingList = () => {
  return (
    <Table sx={{ minWidth: 650 }} aria-label="simple table">
      <TableHead>
        <TableRow>
          <TableCell>Статус</TableCell>
          <TableCell align="center">Отправитель</TableCell>
          <TableCell align="center">Евент</TableCell>
          <TableCell align="center">Номер телефона</TableCell>
          <TableCell align="center">Управление</TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        <TableRow sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
          <TableCell component="th" scope="row">
            <Box
              sx={{
                background: 'green',
                width: '25px',
                height: '25px',
                borderRadius: '50%',
              }}
            ></Box>
          </TableCell>
          <TableCell align="center">1</TableCell>
          <TableCell align="center">1</TableCell>
          <TableCell align="center">1</TableCell>
          <TableCell align="center">
            <ButtonGroup variant="contained" aria-label="outlined primary button group">
              <IconButton aria-label="delete">
                <RemoveCircleIcon />
              </IconButton>
              <Link to="#">
                <IconButton aria-label="delete">
                  <LaunchIcon />
                </IconButton>
              </Link>
            </ButtonGroup>
          </TableCell>
        </TableRow>
      </TableBody>
    </Table>
  );
};

export default BookingList;

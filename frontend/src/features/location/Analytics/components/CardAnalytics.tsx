import React from 'react';
import { StyledTableRow } from '../../../../constants';
import { TableCell, Typography } from '@mui/material';
import { Link } from 'react-router-dom';
import { ILocation } from '../../../../types';

interface Props {
  loc: ILocation;
  openModalOrder: React.MouseEventHandler;
}

const CardAnalytics: React.FC<Props> = ({ loc, openModalOrder }) => {
  return (
    <StyledTableRow key={loc._id} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
      <TableCell component="th" scope="row">
        <Link to={'/' + loc._id}>Локация</Link>
      </TableCell>
      <TableCell align="center">
        <Typography component="p">{(parseInt(loc.price) / 100) * 50}</Typography>
      </TableCell>
      <TableCell align="center">
        <Typography component="p">{loc.price}</Typography>
      </TableCell>
      <TableCell align="center">
        <Typography component="p">50%</Typography>
      </TableCell>
      <TableCell onClick={openModalOrder} align="center">
        <Typography sx={{ cursor: 'pointer' }} component="p">
          {loc.analytics.length}
        </Typography>
      </TableCell>
      <TableCell onClick={openModalOrder} align="center">
        <Typography sx={{ cursor: 'pointer' }} component="p">
          Заказ
        </Typography>
      </TableCell>
    </StyledTableRow>
  );
};

export default CardAnalytics;

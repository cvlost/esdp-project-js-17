import React from 'react';
import { ILocation } from '../../types';
import { StyledTableRow } from '../../constants';
import { Button, TableCell } from '@mui/material';
import photo from '../../images/005.jpg';

interface Props {
  loc: ILocation;
  number: number;
}

const HomeItem: React.FC<Props> = ({ loc, number }) => {
  return (
    <StyledTableRow sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
      <TableCell align="center">{number}</TableCell>
      <TableCell align="center">
        <img
          style={{ width: '230px', height: '153px' }}
          src={photo}
          alt={'г.' + loc.city + ' ' + loc.region + '  ул.' + `${loc?.streets[0] + '/' + loc?.streets[1]}`}
        />
      </TableCell>
      <TableCell align="center">
        {'г.' + loc.city + ' ' + loc.region + ' район' + '  ул.' + `${loc?.streets[0] + '/' + loc?.streets[1]}`}
      </TableCell>
      <TableCell align="center">{loc.region}</TableCell>
      <TableCell align="center">{loc.size}</TableCell>
      <TableCell align="center">{loc.lighting}</TableCell>
      <TableCell align="right">
        <Button
          onClick={() => alert('здесь должна быть модалка для заказа')}
          sx={{ border: '1px dotted #2e7d32' }}
          color="success"
        >
          Запросить
        </Button>
      </TableCell>
    </StyledTableRow>
  );
};

export default HomeItem;

import React from 'react';
import { Button, ButtonGroup, TableCell, Typography } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import { ILocation } from '../../../types';
import { StyledTableRow } from '../../../constants';
import dayjs from 'dayjs';

interface Props {
  onClose: React.MouseEventHandler;
  loc: ILocation;
  number: number;
}

const CardLocation: React.FC<Props> = ({ loc, onClose, number }) => {
  return (
    <StyledTableRow sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
      <TableCell align="center">{number}</TableCell>
      <TableCell align="left" sx={{ py: '5px' }}>
        {`${loc.city} ${loc.street}, ${loc.direction}`}
        {loc.addressNote && (
          <Typography color="gray" fontSize=".85em">
            ({loc.addressNote})
          </Typography>
        )}
      </TableCell>
      <TableCell align="center">{loc.area}</TableCell>
      <TableCell align="center">{loc.city}</TableCell>
      <TableCell align="center">{loc.region}</TableCell>
      <TableCell align="center">{loc.street}</TableCell>
      <TableCell align="center">{loc.direction}</TableCell>
      <TableCell align="center">{loc.legalEntity}</TableCell>
      <TableCell align="center">{loc.size}</TableCell>
      <TableCell align="center">{loc.format}</TableCell>
      <TableCell align="center">{loc.lighting}</TableCell>
      <TableCell align="center">{loc.placement ? 'По направлению' : 'Не по направлению'}</TableCell>
      <TableCell align="center">{loc.price}</TableCell>
      <TableCell align="center">
        {loc.rent && (
          <>
            <Typography>{dayjs(loc.rent.start).format('DD.MM.YYYY')}</Typography>
            <Typography>{dayjs(loc.rent.end).format('DD.MM.YYYY')}</Typography>
          </>
        )}
      </TableCell>
      <TableCell align="center">
        {loc.reserve && (
          <>
            <Typography>{dayjs(loc.reserve.start).format('DD.MM.YYYY')}</Typography>
            <Typography>{dayjs(loc.reserve.end).format('DD.MM.YYYY')}</Typography>
          </>
        )}
      </TableCell>
      <TableCell align="right">
        <ButtonGroup variant="contained" aria-label="outlined primary button group">
          <Button size="small" color="error">
            <DeleteIcon />
          </Button>
          <Button size="small" color="success" onClick={onClose}>
            <EditIcon />
          </Button>
        </ButtonGroup>
      </TableCell>
    </StyledTableRow>
  );
};

export default CardLocation;

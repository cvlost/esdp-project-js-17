import React from 'react';
import { Button, ButtonGroup, TableCell, Typography } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import { ILocation } from '../../../types';
import { StyledTableRow } from '../../../constants';

interface Props {
  onClose: React.MouseEventHandler;
  loc: ILocation;
}

const CardLocation: React.FC<Props> = ({ loc, onClose }) => {
  return (
    <StyledTableRow sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
      <TableCell align="left" sx={{ py: '5px' }}>
        {`${loc.city.name} ${loc.address}, ${loc.direction.name}`}
        {loc.addressNote && (
          <Typography color="gray" fontSize=".85em">
            ({loc.addressNote})
          </Typography>
        )}
      </TableCell>
      <TableCell align="center">{loc.city.name}</TableCell>
      <TableCell align="center">{loc.region.name}</TableCell>
      <TableCell align="center">{loc.direction.name}</TableCell>
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

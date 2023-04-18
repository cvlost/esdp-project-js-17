import React from 'react';
import { Button, ButtonGroup, styled, TableCell, TableRow } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';

interface Props {
  onClose: React.MouseEventHandler;
}

const CardLocation: React.FC<Props> = ({ onClose }) => {
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
          <Button size="small" color="success" onClick={onClose}>
            <EditIcon />
          </Button>
        </ButtonGroup>
      </TableCell>
    </StyledTableRow>
  );
};

export default CardLocation;

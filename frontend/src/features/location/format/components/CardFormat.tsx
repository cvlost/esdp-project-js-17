import React from 'react';
import { CircularProgress, IconButton, TableCell } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import { StyledTableRow } from '../../../../constants';
import { FormatList } from '../../../../types';
import { useAppSelector } from '../../../../app/hooks';
import { selectRemoveFormatLoading } from '../formatSlice';

interface Props {
  format: FormatList;
  removeFormat: React.MouseEventHandler;
}

const CardFormat: React.FC<Props> = ({ removeFormat, format }) => {
  const removeLoading = useAppSelector(selectRemoveFormatLoading);
  return (
    <StyledTableRow sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
      <TableCell align="left">{format.name}</TableCell>
      <TableCell align="right">
        <IconButton disabled={removeLoading} onClick={removeFormat} aria-label="delete">
          {!removeLoading ? <DeleteIcon /> : <CircularProgress />}
        </IconButton>
      </TableCell>
    </StyledTableRow>
  );
};

export default CardFormat;

import React from 'react';
import { StyledTableRow } from '../../../../constants';
import { CircularProgress, IconButton, TableCell } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import { SizeList } from '../../../../types';
import { useAppSelector } from '../../../../app/hooks';
import { selectSizeDeleteLoading } from '../sizeSlice';
import EditIcon from '@mui/icons-material/Edit';

interface Props {
  size: SizeList;
  removeCardSize: React.MouseEventHandler;
  onEditing: React.MouseEventHandler;
}

const CardSize: React.FC<Props> = ({ size, removeCardSize, onEditing }) => {
  const removeLoading = useAppSelector(selectSizeDeleteLoading);
  return (
    <>
      <StyledTableRow sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
        <TableCell align="left">{size.name}</TableCell>
        <TableCell align="right">
          <IconButton disabled={removeLoading} onClick={removeCardSize} aria-label="delete">
            {!removeLoading ? <DeleteIcon /> : <CircularProgress />}
          </IconButton>
          <IconButton aria-label="success" onClick={onEditing}>
            <EditIcon />
          </IconButton>
        </TableCell>
      </StyledTableRow>
    </>
  );
};

export default CardSize;

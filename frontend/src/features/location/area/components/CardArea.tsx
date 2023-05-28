import React from 'react';
import { StyledTableRow } from '../../../../constants';
import { CircularProgress, IconButton, TableCell } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import { useAppSelector } from '../../../../app/hooks';
import { selectRemoveAreaLoading } from '../areaSlice';
import { AreaList } from '../../../../types';
import EditIcon from '@mui/icons-material/Edit';

interface Props {
  area: AreaList;
  removeAreaCard: React.MouseEventHandler;
  onEditing: React.MouseEventHandler;
}

const CardArea: React.FC<Props> = ({ area, removeAreaCard, onEditing }) => {
  const removeLoading = useAppSelector(selectRemoveAreaLoading);
  return (
    <>
      <StyledTableRow sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
        <TableCell align="left">{area.name}</TableCell>
        <TableCell align="right">
          <IconButton disabled={removeLoading} onClick={removeAreaCard} aria-label="delete">
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

export default CardArea;

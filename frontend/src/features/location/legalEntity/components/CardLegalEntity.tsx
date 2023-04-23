import React from 'react';
import { CircularProgress, IconButton, TableCell } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import { StyledTableRow } from '../../../../constants';
import { LegalEntityList } from '../../../../types';
import { useAppSelector } from '../../../../app/hooks';
import { selectRemoveLegalEntityLoading } from '../legalEntitySlice';

interface Props {
  entity: LegalEntityList;
  removeEntity: React.MouseEventHandler;
}

const CardLegalEntity: React.FC<Props> = ({ entity, removeEntity }) => {
  const removeLoading = useAppSelector(selectRemoveLegalEntityLoading);
  return (
    <StyledTableRow sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
      <TableCell align="left">{entity.name}</TableCell>
      <TableCell align="right">
        <IconButton disabled={removeLoading} onClick={removeEntity} aria-label="delete">
          {!removeLoading ? <DeleteIcon /> : <CircularProgress />}
        </IconButton>
      </TableCell>
    </StyledTableRow>
  );
};

export default CardLegalEntity;

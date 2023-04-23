import React from 'react';
import { CircularProgress, IconButton, TableCell } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import { CityList } from '../../../../types';
import { useAppSelector } from '../../../../app/hooks';
import { StyledTableRow } from '../../../../constants';
import { selectRemoveCityLoading } from '../citySlice';

interface Props {
  city: CityList;
  removeCardCity: React.MouseEventHandler;
}

const CardCity: React.FC<Props> = ({ city, removeCardCity }) => {
  const removeLoading = useAppSelector(selectRemoveCityLoading);
  return (
    <>
      <StyledTableRow sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
        <TableCell align="left">{city.name}</TableCell>
        <TableCell align="right">
          <IconButton disabled={removeLoading} onClick={removeCardCity} aria-label="delete">
            {!removeLoading ? <DeleteIcon /> : <CircularProgress />}
          </IconButton>
        </TableCell>
      </StyledTableRow>
    </>
  );
};

export default CardCity;

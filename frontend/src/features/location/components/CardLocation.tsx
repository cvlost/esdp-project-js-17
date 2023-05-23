import React from 'react';
import { Box, Button, ButtonGroup, Paper, Switch, TableCell, Typography } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import { ILocation } from '../../../types';
import { StyledTableRow } from '../../../constants';
import dayjs from 'dayjs';
import { useAppSelector } from '../../../app/hooks';
import { selectCheckedLocationLoading, selectLocationsColumnSettings } from '../locationsSlice';
import { useNavigate } from 'react-router-dom';

interface Props {
  onDelete: React.MouseEventHandler;
  deleteLoading: false | string;
  onEdit: React.MouseEventHandler;
  loc: ILocation;
  number: number;
  checkedCardLocation: React.MouseEventHandler;
  open: boolean;
}

const CardLocation: React.FC<Props> = ({ loc, onEdit, number, onDelete, deleteLoading, checkedCardLocation, open }) => {
  const columns = useAppSelector(selectLocationsColumnSettings);
  const navigate = useNavigate();
  const loadingCheck = useAppSelector(selectCheckedLocationLoading);

  const cells: Record<string, React.ReactNode> = {
    address: (
      <>
        {`${loc.city} ${loc.streets[0] + '/' + loc.streets[1]}, ${loc.direction}`}
        {loc.addressNote && (
          <Typography color="gray" fontSize=".85em">
            ({loc.addressNote})
          </Typography>
        )}
      </>
    ),
    area: <>{loc.area}</>,
    city: <>{loc.city}</>,
    region: <>{loc.region}</>,
    street: <>{loc.streets[0] + '/' + loc.streets[1]}</>,
    direction: <>{loc.direction}</>,
    legalEntity: <>{loc.legalEntity}</>,
    size: <>{loc.size}</>,
    format: <>{loc.format}</>,
    lighting: <>{loc.lighting}</>,
    placement: <>{loc.placement ? 'По направлению' : 'Не по направлению'}</>,
    price: <>{loc.price}</>,
    rent: (
      <>
        {loc.rent && (
          <>
            <Typography>{dayjs(loc.rent.start).format('DD.MM.YYYY')}</Typography>
            <Typography>{dayjs(loc.rent.end).format('DD.MM.YYYY')}</Typography>
          </>
        )}
      </>
    ),
    reserve: (
      <>
        {loc.reserve && (
          <>
            <Typography>{dayjs(loc.reserve.start).format('DD.MM.YYYY')}</Typography>
            <Typography>{dayjs(loc.reserve.end).format('DD.MM.YYYY')}</Typography>
          </>
        )}
      </>
    ),
    status: (
      <>
        <Box
          component="div"
          sx={{
            width: '25px',
            height: '25px',
            background: loc.rent ? '#ff7300' : 'rgb(255,255,255)',
            borderRadius: '50%',
            border: '1px solid #000',
          }}
        ></Box>
      </>
    ),
  };

  return (
    <StyledTableRow sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
      <TableCell onClick={() => navigate(`/location/${loc._id}`)} align="center">
        {number}
      </TableCell>
      {columns
        .filter((col) => col.show)
        .map((col) => (
          <TableCell
            onClick={() => navigate(`/${loc._id}`)}
            key={col.prettyName}
            align="center"
            sx={{ whiteSpace: 'nowrap' }}
          >
            {cells[col.name]}
          </TableCell>
        ))}
      <TableCell align="right">
        <ButtonGroup variant="contained" aria-label="outlined primary button group">
          <Button
            size="small"
            color="error"
            onClick={onDelete}
            disabled={deleteLoading ? deleteLoading === loc._id : false}
          >
            <DeleteIcon />
          </Button>
          <Button size="small" color="success" onClick={onEdit}>
            <EditIcon />
          </Button>
          {open && (
            <Paper sx={{ ml: 1 }} elevation={3}>
              <Switch
                disabled={loadingCheck ? loadingCheck === loc._id : false}
                onClick={checkedCardLocation}
                checked={loc.checked}
              />
            </Paper>
          )}
        </ButtonGroup>
      </TableCell>
    </StyledTableRow>
  );
};

export default CardLocation;

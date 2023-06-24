import React from 'react';
import { Box, Button, ButtonGroup, Divider, Paper, Switch, TableCell, Tooltip, Typography } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import { ILocation } from '../../../types';
import { StyledTableRow } from '../../../constants';
import dayjs from 'dayjs';
import { useAppSelector } from '../../../app/hooks';
import { selectCheckedLocationLoading, selectLocationsColumnSettings } from '../locationsSlice';
import { useNavigate } from 'react-router-dom';
import GroupAddIcon from '@mui/icons-material/GroupAdd';
import FormatListBulletedIcon from '@mui/icons-material/FormatListBulleted';
import TimelineIcon from '@mui/icons-material/Timeline';

interface Props {
  onDelete: React.MouseEventHandler;
  deleteLoading: false | string;
  onEdit: React.MouseEventHandler;
  loc: ILocation;
  number: number;
  checkedCardLocation: React.MouseEventHandler;
  open: boolean;
  rentOpen: React.MouseEventHandler;
  openBooking: React.MouseEventHandler;
  openBookingList: React.MouseEventHandler;
}

const CardLocation: React.FC<Props> = ({
  loc,
  onEdit,
  number,
  onDelete,
  deleteLoading,
  checkedCardLocation,
  open,
  openBooking,
  openBookingList,
  rentOpen,
}) => {
  const columns = useAppSelector(selectLocationsColumnSettings);
  const navigate = useNavigate();
  const loadingCheck = useAppSelector(selectCheckedLocationLoading);
  let duration: string | null = null;

  if (loc.rent) {
    const startDate = dayjs(loc.rent.start);
    const endDate = dayjs(loc.rent.end);
    const currentDate = dayjs();

    if (currentDate.isBefore(startDate)) {
      const daysUntilStart = startDate.diff(currentDate, 'day');
      duration = `Освободится через ${daysUntilStart} дней до начала аренды`;
    } else if (currentDate.isSame(startDate) || currentDate.isAfter(startDate)) {
      const daysRemaining = endDate.diff(currentDate, 'day');
      duration = `Освободится через ${daysRemaining} дней`;
    } else {
      duration = 'Аренда завершена';
    }
  }

  const cells: Record<string, React.ReactNode> = {
    address: (
      <Box onClick={() => navigate(`/${loc._id}`)}>
        {`${loc.city} ${loc.streets[0] + '/' + loc.streets[1]}, ${loc.direction}`}
        {loc.addressNote && (
          <Typography color="gray" fontSize="14px">
            ({loc.addressNote})
          </Typography>
        )}
      </Box>
    ),
    area: (
      <Typography fontSize="14px" onClick={() => navigate(`/${loc._id}`)}>
        {loc.area}
      </Typography>
    ),
    city: (
      <Typography fontSize="14px" onClick={() => navigate(`/${loc._id}`)}>
        {loc.city}
      </Typography>
    ),
    region: (
      <Typography fontSize="14px" onClick={() => navigate(`/${loc._id}`)}>
        {loc.region}
      </Typography>
    ),
    streets: (
      <Typography fontSize="14px" onClick={() => navigate(`/${loc._id}`)}>
        {loc.streets[0] + '/' + loc.streets[1]}
      </Typography>
    ),
    direction: (
      <Typography fontSize="14px" onClick={() => navigate(`/${loc._id}`)}>
        {loc.direction}
      </Typography>
    ),
    legalEntity: (
      <Typography fontSize="14px" onClick={() => navigate(`/${loc._id}`)}>
        {loc.legalEntity}
      </Typography>
    ),
    size: (
      <Typography fontSize="14px" onClick={() => navigate(`/${loc._id}`)}>
        {loc.size}
      </Typography>
    ),
    format: (
      <Typography fontSize="14px" onClick={() => navigate(`/${loc._id}`)}>
        {loc.format}
      </Typography>
    ),
    lighting: (
      <Typography fontSize="14px" onClick={() => navigate(`/${loc._id}`)}>
        {loc.lighting}
      </Typography>
    ),
    placement: (
      <Typography fontSize="14px" onClick={() => navigate(`/${loc._id}`)}>
        {loc.placement ? 'По направлению' : 'Не по направлению'}
      </Typography>
    ),
    price: (
      <Typography fontSize="14px" onClick={() => navigate(`/${loc._id}`)}>
        {loc.price}
      </Typography>
    ),
    rent: (
      <div onClick={rentOpen}>
        {loc.rent ? (
          <>
            <Typography fontSize="14px" sx={{ color: 'green' }}>
              {loc.client}
            </Typography>
            <Typography fontSize="14px">{dayjs(loc.rent.start).format('DD.MM.YYYY')}</Typography>
            <Typography fontSize="14px">{dayjs(loc.rent.end).format('DD.MM.YYYY')}</Typography>
          </>
        ) : (
          'Свободен'
        )}
      </div>
    ),
    status: (
      <div style={{ display: 'flex', justifyContent: 'center' }}>
        <Tooltip
          title={
            <>
              <Typography color="inherit">
                {loc.rent
                  ? `Занят: от ${dayjs(loc.rent.start).format('DD.MM.YYYY')} до ${dayjs(loc.rent.end).format(
                      'DD.MM.YYYY',
                    )}`
                  : 'Свободный'}
              </Typography>
              <Divider />
              {duration && <Typography color="inherit">{duration}</Typography>}
            </>
          }
        >
          <Box
            component="div"
            sx={{
              width: '25px',
              height: '25px',
              background: loc.rent ? '#ff7300' : 'rgb(255,255,255)',
              borderRadius: '50%',
              border: '1px solid #2e7d32',
            }}
          ></Box>
        </Tooltip>
      </div>
    ),
    booking: (
      <>
        {loc.booking.length !== 0 ? (
          <Box>
            <Tooltip title="Добавить бронь">
              <Button onClick={openBooking} size="small" color="success">
                <GroupAddIcon />
              </Button>
            </Tooltip>
            <Tooltip title="Список броней">
              <Button onClick={openBookingList} size="small" color="success">
                <FormatListBulletedIcon />
              </Button>
            </Tooltip>
          </Box>
        ) : (
          <Typography fontSize="14px" onClick={openBooking}>
            Нет
          </Typography>
        )}
      </>
    ),
  };

  return (
    <StyledTableRow sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
      <TableCell align="center">{number}</TableCell>
      {columns
        .filter((col) => col.show)
        .map((col) => (
          <TableCell key={col.prettyName} align="center" sx={{ whiteSpace: 'nowrap' }}>
            {cells[col.name]}
          </TableCell>
        ))}
      <TableCell align="right">
        <ButtonGroup sx={{ mr: 1 }} variant="contained">
          <Tooltip title="Удалить">
            <Button
              size="small"
              color="error"
              onClick={onDelete}
              disabled={deleteLoading ? deleteLoading === loc._id : false}
            >
              <DeleteIcon />
            </Button>
          </Tooltip>
          <Tooltip title="Редактировать">
            <Button size="small" color="success" onClick={onEdit}>
              <EditIcon />
            </Button>
          </Tooltip>
          <Tooltip title="История Аренды">
            <Button onClick={() => navigate('/rentHistory/' + loc._id)} size="small" color="info">
              <TimelineIcon />
            </Button>
          </Tooltip>
          <Tooltip title="Добавить бронь">
            <Button onClick={openBooking} size="small" color="primary">
              <GroupAddIcon />
            </Button>
          </Tooltip>
          {open && (
            <Paper sx={{ ml: 1 }} elevation={3}>
              <Switch
                color="success"
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

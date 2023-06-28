import React from 'react';
import { Grid, Paper, Tooltip, Typography } from '@mui/material';
import { Link } from 'react-router-dom';
import dayjs from 'dayjs';
import { LocationGraphicType } from '../../../../types';

interface Props {
  loc: LocationGraphicType;
  month: string;
  index: number;
}

const LocationCardGrap: React.FC<Props> = ({ loc, month, index }) => {
  const getStyle = (loc: LocationGraphicType) => {
    if (loc.rent !== null && loc.booking.length > 0) {
      return 'linear-gradient(to right, green 50%, gold 50%)';
    } else if (loc.rent) {
      return 'green';
    } else if (loc.booking.length !== 0) {
      return 'gold';
    } else if (loc.rent === null && loc.booking.length === 0) {
      return '#fff';
    }
  };

  return (
    <Grid xs={2} sm={2} md={2} item>
      <Tooltip
        title={
          <>
            <Link style={{ color: '#fff', fontSize: '18px' }} to={`/${loc._id}`}>
              Перейти к локации...
            </Link>
            <Typography sx={{ color: '#fff', display: 'block', my: 1 }} component="span" color="inherit">
              {loc.rent
                ? `Аренда от ${dayjs(loc.rent.start).format('DD.MM.YYYY')} до ${dayjs(loc.rent.end).format(
                    'DD.MM.YYYY',
                  )}`
                : 'Аренда свободна'}
            </Typography>
            <Typography sx={{ color: '#fff', display: 'block', my: 1 }} component="span" color="inherit">
              {loc.booking.length !== 0
                ? loc.booking.map((book) => (
                    <Typography
                      key={book._id}
                      sx={{ color: '#fff', display: 'block', my: 1 }}
                      component="span"
                      color="inherit"
                    >
                      {`Бронь от ${dayjs(book.booking_date.start).format('DD.MM.YYYY')} до ${dayjs(
                        book.booking_date.end,
                      ).format('DD.MM.YYYY')}`}
                    </Typography>
                  ))
                : 'Бронь свободна'}
            </Typography>
            <Typography sx={{ color: '#fff', display: 'block' }} component="span" color="inherit">
              Цена: {loc.price} сом
            </Typography>
          </>
        }
      >
        <Paper
          sx={{
            width: '100%',
            height: '100px',
            background: getStyle(loc),
            marginRight: '10px',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            color: '#000',
            fontSize: '25px',
            fontWeight: 'bold',
            cursor: loc.month === month ? 'grab' : 'zoom-in',
            mb: 2,
          }}
          elevation={5}
        >
          {index + 1}
        </Paper>
      </Tooltip>
    </Grid>
  );
};

export default LocationCardGrap;

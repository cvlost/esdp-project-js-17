import React from 'react';
import { Box, Grid, Paper, Tooltip } from '@mui/material';
import { useAppSelector } from '../../../../app/hooks';
import { selectLocationsListData } from '../../locationsSlice';

interface Props {
  pullingMonth: string;
}

const PanelAccounts: React.FC<Props> = ({ pullingMonth }) => {
  const locationsListData = useAppSelector(selectLocationsListData);
  return (
    <Paper
      sx={{
        display: 'flex',
        justifyContent: 'space-around',
        p: 1,
        textAlign: 'center',
        lineHeight: '50px',
        fontSize: '25px',
      }}
      elevation={3}
    >
      <Grid justifyContent="space-evenly" container>
        <Grid item>
          <Tooltip title="Бронь">
            <Box component="div" sx={{ width: '50px', height: '50px', background: 'gold' }}>
              {
                locationsListData.locations
                  .filter((item) => item.month === pullingMonth)
                  .filter((book) => book.booking.length > 0).length
              }
            </Box>
          </Tooltip>
        </Grid>
        <Grid item>
          <Tooltip title="Свободный">
            <Box component="div" sx={{ width: '50px', height: '50px', background: '#fff', border: '1px solid #ddd' }}>
              {
                locationsListData.locations
                  .filter((item) => item.month === pullingMonth)
                  .filter((book) => book.booking.length === 0 && book.rent === null).length
              }
            </Box>
          </Tooltip>
        </Grid>
        <Grid item>
          <Tooltip title="Аренда">
            <Box component="div" sx={{ width: '50px', height: '50px', background: 'green' }}>
              {
                locationsListData.locations
                  .filter((item) => item.month === pullingMonth)
                  .filter((book) => book.rent !== null).length
              }
            </Box>
          </Tooltip>
        </Grid>
      </Grid>
    </Paper>
  );
};

export default PanelAccounts;

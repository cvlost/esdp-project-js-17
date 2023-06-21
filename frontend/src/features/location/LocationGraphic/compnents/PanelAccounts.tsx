import React from 'react';
import { Box, Paper } from '@mui/material';
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
      <Box component="div" sx={{ width: '50px', height: '50px', background: 'gold' }}>
        {
          locationsListData.locations
            .filter((item) => item.month === pullingMonth)
            .filter((book) => book.booking.length > 0).length
        }
      </Box>
      <Box component="div" sx={{ width: '50px', height: '50px', background: '#fff', border: '1px solid #ddd' }}>
        {
          locationsListData.locations
            .filter((item) => item.month === pullingMonth)
            .filter((book) => book.booking.length === 0 && book.rent === null).length
        }
      </Box>
      <Box component="div" sx={{ width: '50px', height: '50px', background: 'green' }}>
        {
          locationsListData.locations.filter((item) => item.month === pullingMonth).filter((book) => book.rent !== null)
            .length
        }
      </Box>
    </Paper>
  );
};

export default PanelAccounts;

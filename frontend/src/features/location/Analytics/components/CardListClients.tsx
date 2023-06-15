import React from 'react';
import { Box, Chip, Paper } from '@mui/material';
import dayjs from 'dayjs';
import { ClientsHistoryType } from '../../../../types';

interface Props {
  history: ClientsHistoryType;
}

const CardListClients: React.FC<Props> = ({ history }) => {
  return (
    <>
      <Box sx={{ mr: 2 }}>
        <Chip sx={{ mb: 1 }} label="Заказчик" variant="outlined" />
        <Paper sx={{ p: 1 }}>{history.client}</Paper>
      </Box>
      <Box sx={{ mr: 2 }}>
        <Chip sx={{ mb: 1 }} label="Колл.. дней" variant="outlined" />
        <Paper sx={{ p: 1 }}>{dayjs(history.end.date).diff(dayjs(history.start.date), 'day')}</Paper>
      </Box>
      <Box sx={{ mr: 2 }}>
        <Chip sx={{ mb: 1 }} label="Старт месяца" variant="outlined" />
        <Paper sx={{ p: 1 }}>{history.start.month}</Paper>
      </Box>
      <Box sx={{ mr: 2 }}>
        <Chip sx={{ mb: 1 }} label="Начало месяца" variant="outlined" />
        <Paper sx={{ p: 1 }}>{history.end.month}</Paper>
      </Box>
      <Box>
        <Chip sx={{ mb: 1 }} label="Год" variant="outlined" />
        <Paper sx={{ p: 1 }}>{history.year}</Paper>
      </Box>
    </>
  );
};

export default CardListClients;

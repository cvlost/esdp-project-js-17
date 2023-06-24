import { IRole } from './types';
import { styled, TableCell, tableCellClasses, TableRow } from '@mui/material';

export const apiURL = process.env.REACT_APP_API_URL || 'http://localhost:8000';

export const ROLES: IRole[] = [
  {
    prettyName: 'Администратор',
    name: 'admin',
  },
  {
    prettyName: 'Пользователь',
    name: 'user',
  },
];

export const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: MainColorGreen,
    color: theme.palette.common.white,
  },
}));

export const StyledTableRow = styled(TableRow)(() => ({
  '&:nth-of-type(odd)': {
    backgroundColor: '#e3f2fd',
  },
  // hide last border
  '&:last-child td, &:last-child th': {
    border: 0,
  },
}));

export const MainColorGreen = '#2e7d32';
export const ARR = [
  'Январь',
  'Февраль',
  'Март',
  'Апрель',
  'Май',
  'Июнь',
  'Июль',
  'Август',
  'Сентябрь',
  'Октябрь',
  'Ноябрь',
  'Декабрь',
];

export const YEAR = [2020, 2021, 2022, 2023, 2024, 2025, 2026, 2027];

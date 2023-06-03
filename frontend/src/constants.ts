import { IRole } from './types';
import { styled, TableCell, tableCellClasses, TableRow } from '@mui/material';

export const apiURL = 'http://localhost:8000';

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

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
    backgroundColor: '#1976d2',
    color: theme.palette.common.white,
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
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

export const BILLBOARD_SIZES = ['2,7x5,7', '2x5', '3x12', '3x14,42', '3x16', '3x18', '3x6', '4x10'] as const;
export const BILLBOARD_LIGHTINGS = ['Внутренее', 'Внешнее'] as const;

export const MainColorGreen = '#2e7d32';

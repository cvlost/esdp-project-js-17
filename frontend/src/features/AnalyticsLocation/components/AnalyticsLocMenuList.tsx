import React from 'react';
import { StyledTableCell } from '../../../constants';

const AnalyticsLocMenuList = () => {
  return (
    <>
      <StyledTableCell align="center">Фото локации</StyledTableCell>
      <StyledTableCell sx={{ minWidth: '250px', textAlign: 'center' }}>Локация</StyledTableCell>
      <StyledTableCell align="center">Итого дней</StyledTableCell>
      <StyledTableCell align="center">Итого прайс-лист, сом</StyledTableCell>
      <StyledTableCell align="center">Итого факт, сом</StyledTableCell>
      <StyledTableCell align="center">Эффективность (арендодни), %</StyledTableCell>
      <StyledTableCell align="center">Эффективность ПЛ (финансы), %</StyledTableCell>
    </>
  );
};

export default AnalyticsLocMenuList;

import React from 'react';
import { ARR, StyledTableCell } from '../../../constants';
import { Tooltip, Typography } from '@mui/material';
import { useAppSelector } from '../../../app/hooks';
import { selectAnalyticsClientList } from '../AnalyticsClientSlice';

const AnalyticsClientMenuList = () => {
  const analyticsClientList = useAppSelector(selectAnalyticsClientList);

  const totalBudgetPerMonth = (month: string) => {
    const total = analyticsClientList.clintAnalNew
      .map((item) => {
        return item.anal.filter((item) => item.month === month).map((anal) => anal.total);
      })
      .flat(1);

    return total.reduce((acc, value) => acc + parseInt(value), 0);
  };

  const generalBudget = () => {
    return analyticsClientList.clintAnalNew.reduce((acc, value) => acc + value.overallBudget, 0);
  };

  const totalNumberOfRentalDays = () => {
    return analyticsClientList.clintAnalNew.reduce((acc, value) => acc + value.rentDay, 0);
  };

  const generalNumberOfBanners = () => {
    return analyticsClientList.clintAnalNew.reduce((acc, value) => acc + value.numberOfBanners, 0);
  };

  return (
    <>
      <StyledTableCell>Клиенты</StyledTableCell>
      {ARR.map((month) => (
        <StyledTableCell key={month} align="center">
          <Tooltip
            placement="top"
            title={
              <Typography color="inherit" sx={{ padding: '10px' }}>
                {totalBudgetPerMonth(month)}
              </Typography>
            }
          >
            <p style={{ cursor: 'pointer' }}>{month.toLocaleUpperCase()}</p>
          </Tooltip>
        </StyledTableCell>
      ))}
      <StyledTableCell align="center">
        <Tooltip
          placement="top"
          title={
            <Typography color="inherit" style={{ padding: '10px' }}>
              {generalBudget()}
            </Typography>
          }
        >
          <p style={{ cursor: 'pointer' }}>Общий бюджет</p>
        </Tooltip>
      </StyledTableCell>
      <StyledTableCell align="center">
        <Tooltip
          placement="top"
          title={
            <Typography color="inherit" style={{ padding: '10px' }}>
              {totalNumberOfRentalDays()}
            </Typography>
          }
        >
          <p style={{ cursor: 'pointer' }}>Дни аренды</p>
        </Tooltip>
      </StyledTableCell>
      <StyledTableCell align="center">
        <Tooltip
          placement="top"
          title={
            <Typography color="inherit" style={{ padding: '10px' }}>
              {generalNumberOfBanners()}
            </Typography>
          }
        >
          <p style={{ cursor: 'pointer' }}>Количество баннеров</p>
        </Tooltip>
      </StyledTableCell>
    </>
  );
};

export default AnalyticsClientMenuList;

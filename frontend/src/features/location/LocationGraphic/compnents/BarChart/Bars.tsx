import React from 'react';
import { ScaleBand, ScaleLinear } from 'd3';
import { IData } from '../../../../../types';
import { Box, Tooltip, Typography } from '@mui/material';
import dayjs from 'dayjs';

interface BarChartProps {
  data: IData[];
}

interface AxisBottomProps {
  scale: ScaleBand<string>;
  transform: string;
}

interface AxisLeftProps {
  scale: ScaleLinear<number, number, never>;
}

interface Props {
  data: BarChartProps['data'];
  height: number;
  scaleX: AxisBottomProps['scale'];
  scaleY: AxisLeftProps['scale'];
}

const Bars: React.FC<Props> = ({ data, height, scaleY, scaleX }) => {
  return (
    <>
      {data.map(({ value, label, tooltip }) => (
        <Tooltip
          placement="right"
          key={`bar-${label}`}
          title={
            <>
              {tooltip.map((book) => (
                <Box key={book._id}>
                  <Typography sx={{ color: '#fff', display: 'block', my: 1 }} component="span" color="inherit">
                    {`Занятость от ${dayjs(book.booking_date.start).format('DD.MM.YYYY')} до ${dayjs(
                      book.booking_date.end,
                    ).format('DD.MM.YYYY')}`}
                  </Typography>
                  <Typography sx={{ color: '#fff', display: 'block' }} component="span" color="inherit">
                    Клиент: {book.clientId}
                  </Typography>
                </Box>
              ))}
            </>
          }
        >
          <rect
            x={scaleX(label)}
            y={scaleY(value)}
            width={scaleX.bandwidth()}
            height={height - scaleY(value)}
            fill="teal"
          />
        </Tooltip>
      ))}
    </>
  );
};

export default Bars;

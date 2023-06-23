import React from 'react';
import { ScaleBand, ScaleLinear } from 'd3';
import { Box, Tooltip } from '@mui/material';
import { IData } from '../../types';

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
      {data.map(({ value, label, tooltip, comp }) => (
        <Tooltip
          placement="right"
          key={`bar-${label}`}
          title={
            <>
              {tooltip.map((_, index) => (
                <Box key={index}>{comp}</Box>
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

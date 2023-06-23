import React, { useEffect, useRef } from 'react';
import { axisLeft, ScaleLinear, select } from 'd3';

interface Props {
  scale: ScaleLinear<number, number, never>;
}

const AxisLeft: React.FC<Props> = ({ scale }) => {
  const ref = useRef<SVGGElement>(null);

  useEffect(() => {
    if (ref.current) {
      select(ref.current).call(axisLeft(scale));
    }
  }, [scale]);
  return <g ref={ref} />;
};

export default AxisLeft;

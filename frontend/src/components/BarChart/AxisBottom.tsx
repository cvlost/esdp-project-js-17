import React, { useEffect, useRef } from 'react';
import { axisBottom, ScaleBand, select } from 'd3';

interface Props {
  scale: ScaleBand<string>;
  transform: string;
}

const AxisBottom: React.FC<Props> = ({ scale, transform }) => {
  const ref = useRef<SVGGElement>(null);

  useEffect(() => {
    if (ref.current) {
      select(ref.current).call(axisBottom(scale));
    }
  }, [scale]);
  return <g scale={2} ref={ref} transform={transform} />;
};

export default AxisBottom;

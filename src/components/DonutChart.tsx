import * as d3 from 'd3';

import React, { useEffect, useRef, useState } from 'react';

import { IBaseData, IMargin } from '@/types/chart';

interface IDonutChart {
  data: IBaseData[];
  width: number;
  height: number;
  format: string;
  colors: string[];
  padAngle: number;
  margin: IMargin;
}
export default function DonutChart({
  data,
  width, // outer width, in pixels
  height, // outer height, in pixels
  margin,
  format, // a format specifier for values (in the label)
  colors, // array of colors for names
  padAngle = 0.02, // angular separation between wedges
}: IDonutChart) {
  const donutChartRef = useRef(null);

  /* eslint-disable-next-line @typescript-eslint/no-unused-vars */
  const [key, setKey] = useState(data[0].name);

  useEffect(() => {
    const ref = donutChartRef.current;

    const names = d3.map(data, (d) => d.name);

    const chartWidth = width - margin.left - margin.right;
    const chartHeight = height - margin.top - margin.bottom;

    const chartRoot = d3.select(ref);

    const div = chartRoot.append('div').style('width', `${width}px`).style('position', 'relative');

    const svgWidth = width + margin.left + margin.right;
    const svgHeight = chartHeight + margin.top + margin.bottom;

    const svg = chartRoot
      .append('svg')
      .attr('width', svgWidth)
      .attr('height', svgHeight)
      .attr('viewBox', [-chartWidth / 2, -chartHeight / 2, chartWidth, chartHeight]);

    const radius = Math.min(chartWidth, chartHeight) / 2;

    const arc = d3
      .arc<d3.PieArcDatum<IBaseData>>()
      .innerRadius(radius * 0.8)
      .outerRadius(radius)
      .cornerRadius(4);

    const pie = d3
      .pie<IBaseData>()
      .padAngle(padAngle)
      .value((d) => d.value);

    const colorScale = d3.scaleOrdinal<IBaseData['name']>().domain(names).range(colors);

    svg
      .append('g')
      .selectAll('path')
      .data(pie(data))
      .join('path')
      .attr('fill', (d) => colorScale(d.data.name))
      .attr('d', arc);

    div
      .append('div')
      .style('position', 'absolute')
      .style('display', 'flex')
      .style('align-items', 'center')
      .style('text-align', 'center')
      .style('font-size', '50px')
      .style('font-weight', 'bold')
      .style('width', `${svgWidth}px`)
      .style('height', `${svgHeight}px`)
      .style('color', colorScale(key))
      .append('div')
      .style('width', `${svgWidth}px`)
      .text(d3.format(format)((data.find((d) => d.name === key) as IBaseData).value / 100));

    return () => {
      d3.select(ref).select('svg').remove();
    };
  }, [key, colors, width, height, margin, data, format, padAngle]);

  return <div ref={donutChartRef} />;
}

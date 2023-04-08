import * as d3 from 'd3';

import React, { useEffect, useRef } from 'react';

import { BarValue, IChartSVG, IMargin, TColor } from '@/types/chart';

interface IBarChartProps extends IChartSVG {
  data: BarValue[];
  margin?: IMargin;
  color: TColor;
}

export default function BarChart({ margin, width, height, data, color }: IBarChartProps) {
  const barChartRef = useRef(null);

  useEffect(() => {
    const names: string[] = [
      ...data.reduce((acc, cur) => {
        acc.add(cur.name);

        return acc;
      }, new Set<string>()),
    ];

    const svg = d3
      .select(barChartRef.current)
      .attr('width', width + (margin?.left ?? 0) + (margin?.right ?? 0))
      .attr('height', height + (margin?.top ?? 0) + (margin?.bottom ?? 0));
    // .attr("viewBox", [0, 0, width, height])

    const xScale = d3
      .scaleBand()
      .domain(names)
      .range([margin?.left ?? 0, width - (margin?.right ?? 0)])
      .paddingInner(0.2);

    const yScale = d3
      .scaleLinear()
      .domain([0, d3.max<BarValue, number>(data, (d) => d.value) ?? 0])
      .range([height - (margin?.bottom ?? 0), margin?.top ?? 0]);

    const xAxis = d3.axisBottom(xScale);
    const yAxis = d3.axisLeft(yScale);

    const chart = svg
      .append('g')
      .attr('transform', `translate(${margin?.left ?? 0}, ${margin?.top ?? 0})`);

    chart
      .append('g')
      .attr('transform', `translate(0, ${height - (margin?.bottom ?? 0) + 1})`)
      .call(xAxis);

    chart
      .append('g')
      .attr('transform', `translate(${margin?.left ?? 0}, 0)`)
      .call(yAxis);

    chart
      .append('g')
      .selectAll('rect')
      .data(data)
      .join('rect')
      .attr('fill', color)
      .attr('x', (d) => xScale(d.name) ?? 0)
      .attr('y', (d) => yScale(d.value))
      .attr('width', xScale.bandwidth())
      .attr('height', (d) => yScale(0) - yScale(d.value))
      .on('mouseover', function () {
        d3.select(this).attr('fill', 'orange');
      })
      .on('mouseout', function () {
        d3.select(this).attr('fill', color);
      });
  }, [data, width, height, margin, color]);

  return <svg ref={barChartRef}></svg>;
}

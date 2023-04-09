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
    const ref = barChartRef.current;

    const names: string[] = [
      ...data.reduce((acc, cur) => {
        acc.add(cur.name);

        return acc;
      }, new Set<string>()),
    ];

    const svg = d3
      .select(ref)
      .append('svg')
      .attr('width', width + (margin?.left ?? 0) + (margin?.right ?? 0))
      .attr('height', height + (margin?.top ?? 0) + (margin?.bottom ?? 0));

    const tooltip = d3
      .select(barChartRef.current)
      .append('div')
      .attr('class', 'tooltip')
      .style('opacity', 1);

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
      .selectAll<SVGRectElement, BarValue>('rect')
      .data(data)
      .join('rect')
      .attr('fill', color)
      .attr('x', (d) => xScale(d.name) ?? 0)
      .attr('y', (d) => yScale(d.value))
      .attr('width', xScale.bandwidth())
      .attr('height', (d) => yScale(0) - yScale(d.value))
      .on('mouseover', function (e) {
        const bar = d3.select<SVGRectElement, BarValue>(this);

        bar.attr('fill', 'orange');

        const { name, value } = bar.datum();

        tooltip
          .html(
            `
          <p class="tooltip__header"  style="font-weight: 700; margin-bottom: 8px;">${name}</p>
          <p>${value}</p>
        `
          )
          .style('opacity', 1)
          .style('z-index', 1)
          .style('position', 'absolute')
          .style('background', 'white')
          .style('width', '200px')
          .style('height', '90px')
          .style('border-radius', '20px')
          .style('color', '#111111')
          .style('padding', '20px')
          .style('top', e.pageY - 10 + 'px')
          .style('left', e.pageX + 10 + 'px')
          .style('font-size', '16px')
          .style('word-break', 'break-all');
      })
      .on('mouseout', function (e) {
        d3.select(this).attr('fill', color);

        const bar = d3.select<SVGRectElement, BarValue>(this);
        const { name, value } = bar.datum();

        tooltip
          .html(
            `
            <div class="tooltip">
              <p class="tooltip__header" style="font-weight: 700;">${name}</p>
              <p>${value}</p>
            </div>
          `
          )
          .style('opacity', 0)
          .style('z-index', -1)
          .style('position', 'absolute')
          .style('background', 'white')
          .style('width', '200px')
          .style('height', '100px')
          .style('border-radius', '20px')
          .style('color', '#111111')
          .style('padding', '20px')
          .style('top', e.pageY - 10 + 'px')
          .style('left', e.pageX + 10 + 'px')
          .style('font-size', '16px')
          .style('word-break', 'break-all');
      });

    return () => {
      d3.select(ref).selectAll('svg').remove();
      d3.select(ref).selectAll('.tooltip').remove();
    };
  }, [data, width, height, margin, color]);

  return <div ref={barChartRef} />;
}

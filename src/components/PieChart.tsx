import * as d3 from 'd3';

import React, { useEffect, useMemo, useRef } from 'react';

interface IPieChartData {
  name: string;
  value: string | number;
}

interface IRefinedChartData extends IPieChartData {
  value: number;
}

interface IPieChartProps {
  width: number;
  height: number;
  color: string[];
  data: IPieChartData[];
}

const getRefinedData = (data: IPieChartData[]): IRefinedChartData[] => {
  return data.map((d) => ({
    ...d,
    value: parseFloat(d.value as string),
  }));
};

export default function PieChart({ width, height, data, color }: IPieChartProps) {
  const refinedData = useMemo(() => getRefinedData(data), [data]);

  const radius = Math.min(width, height) / 2;

  const pieChartRef = useRef(null);

  useEffect(() => {
    const svg = d3
      .select(pieChartRef.current)
      .attr('width', width)
      .attr('height', height)
      .attr('viewBox', [-width / 2, -height / 2, width, height]);

    const arc = d3.arc<d3.PieArcDatum<IRefinedChartData>>().innerRadius(0).outerRadius(radius);

    const pie = d3.pie<IRefinedChartData>().value((d) => d.value)(refinedData);

    const colorScale = d3
      .scaleOrdinal<string>()
      .domain(refinedData.map((d) => d.name))
      .range(color);

    svg
      .append('g')
      .selectAll()
      .data(pie) // pie 배열의 데이터 포인트만큼
      .join('path') // path를 넣고
      .attr('fill', (d) => colorScale(d.data.name)) // colorScale에 해당하는 색 줌.
      .attr('d', arc)
      .on('mouseover', function () {
        if (!this) return;

        const datum = d3.select<SVGPathElement, d3.PieArcDatum<IRefinedChartData>>(this).datum();

        d3.select(this).transition().duration(300).attr('fill', 'orange');

        activeLabels(datum);
      })
      .on('mouseout', function () {
        if (!this) return;

        const datum = d3.select<SVGPathElement, d3.PieArcDatum<IRefinedChartData>>(this).datum();

        d3.select<SVGPathElement, d3.PieArcDatum<IRefinedChartData>>(this)
          .transition()
          .duration(300)
          .attr('fill', (d) => colorScale(d.data.name));

        inactiveLabels(datum);
      });

    const arcLabel = svg
      .append('g')
      .attr('font-family', 'sans-serif')
      .attr('font-size', 10)
      .attr('text-anchor', 'middle')
      .selectAll('text')
      .data(pie)
      .join('text')
      .attr('transform', (d) => `translate(${arc.centroid(d)})`);

    const names = arcLabel
      .append('tspan')
      .attr('x', 0)
      .attr('y', '-0.5rem')
      .attr('font-size', '1rem')
      .attr('font-weight', 'bold')
      .attr('fill-opacity', 0.97)
      .text((d) => d.data.name);

    const values = arcLabel
      .append('tspan')
      .attr('x', 0)
      .attr('y', '0.5em')
      .attr('font-size', '0.75rem')
      .attr('fill-opacity', 0.7)
      .text((d) => d.data.value.toLocaleString() + '%');

    function activeLabels(datum: d3.PieArcDatum<IRefinedChartData>) {
      [names, values].forEach((selections) => {
        selections.each(function (d) {
          if (datum.data.name === d.data.name) {
            d3.select(this).attr('fill', 'white');
          }
        });
      });
    }

    function inactiveLabels(datum: d3.PieArcDatum<IRefinedChartData>) {
      [names, values].forEach((selections) => {
        selections.each(function (d) {
          if (datum.data.name === d.data.name) {
            d3.select(this).attr('fill', 'black');
          }
        });
      });
    }
  }, [color, height, width, radius, refinedData]);

  return <svg ref={pieChartRef}></svg>;
}

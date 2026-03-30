import { useEffect, useRef } from "react";
import * as d3 from "d3";

const CHART_WIDTH = 760;
const CHART_HEIGHT = 420;
const MARGIN = { top: 24, right: 24, bottom: 44, left: 52 };

export default function Visualization({ data, step }) {
  const ref = useRef(null);

  useEffect(() => {
    if (!data?.length) return;

    const svg = d3.select(ref.current);
    svg.selectAll("*").remove();

    const width = CHART_WIDTH;
    const height = CHART_HEIGHT;

    const xMin = d3.min(data, (d) => d.x) ?? -5;
    const xMax = d3.max(data, (d) => d.x) ?? 5;
    const yMin = d3.min(data, (d) => d.y) ?? -1;
    const yMax = d3.max(data, (d) => d.y) ?? 1;

    const xPad = (xMax - xMin || 1) * 0.06;
    const yPad = (yMax - yMin || 1) * 0.15;

    const xScale = d3.scaleLinear()
      .domain([xMin - xPad, xMax + xPad])
      .range([MARGIN.left, width - MARGIN.right]);

    const yScale = d3.scaleLinear()
      .domain([yMin - yPad, yMax + yPad])
      .range([height - MARGIN.bottom, MARGIN.top]);

    const chart = svg
      .attr("viewBox", `0 0 ${width} ${height}`)
      .attr("preserveAspectRatio", "xMidYMid meet")
      .append("g");

    // axes
    chart.append("g")
      .attr("transform", `translate(0,${height - MARGIN.bottom})`)
      .call(d3.axisBottom(xScale));

    chart.append("g")
      .attr("transform", `translate(${MARGIN.left},0)`)
      .call(d3.axisLeft(yScale));

    // data points (always visible)
    chart.selectAll(".point")
      .data(data)
      .enter()
      .append("circle")
      .attr("class", "point")
      .attr("cx", d => xScale(d.x))
      .attr("cy", d => yScale(d.y))
      .attr("r", 4)
      .attr("fill", "#d4af37");

    // stop here if no step yet
    if (!step) return;

    // curve
    const xValues = d3.range(xMin - xPad, xMax + xPad, 0.08);

    const curveData = xValues.map(x => {
      let y = 0;
      try {
        if (step.model) {
          y = step.model.predictOne([x]);
        }
      } catch {
        y = 0;
      }
      return { x, y };
    });

    const line = d3.line()
      .curve(d3.curveMonotoneX)
      .x(d => xScale(d.x))
      .y(d => yScale(d.y));

    chart.append("path")
      .datum(curveData)
      .attr("fill", "none")
      .attr("stroke", "#00ffff")
      .attr("stroke-width", 2.5)
      .attr("d", line);

    // epsilon tube
    if (step.epsilon !== undefined) {
      const upper = curveData.map(d => ({ x: d.x, y: d.y + step.epsilon }));
      const lower = curveData.map(d => ({ x: d.x, y: d.y - step.epsilon }));

      chart.append("path")
        .datum(upper)
        .attr("fill", "none")
        .attr("stroke", "#888")
        .attr("stroke-dasharray", "5,5")
        .attr("d", line);

      chart.append("path")
        .datum(lower)
        .attr("fill", "none")
        .attr("stroke", "#888")
        .attr("stroke-dasharray", "5,5")
        .attr("d", line);
    }

    // support vectors
    if (step.supportVectors?.length) {
      chart.selectAll(".sv")
        .data(step.supportVectors)
        .enter()
        .append("circle")
        .attr("class", "sv")
        .attr("cx", d => xScale(d.x))
        .attr("cy", d => yScale(d.y))
        .attr("r", 6)
        .attr("fill", "#ff4d6d")
        .attr("stroke", "#fff")
        .attr("stroke-width", 1.5);
    }

    // predictions
    if (step.predictions?.length) {
      chart.selectAll(".pred")
        .data(step.predictions)
        .enter()
        .append("circle")
        .attr("class", "pred")
        .attr("cx", d => xScale(d.x))
        .attr("cy", d => yScale(d.pred))
        .attr("r", 3)
        .attr("fill", "#00ffff");
    }

  }, [data, step]);

  return (
    <section className="viz-panel">
      <h3>Model Visualization</h3>
      <span className="viz-chip">SVR Fit + ε Tube</span>

      {/* SINGLE SVG */}
      <svg ref={ref} className="viz-svg" />

      {/* Legend */}
      <div className="legend">
        <span style={{ color: "#d4af37" }}>● Data</span> &nbsp;&nbsp;
        <span style={{ color: "#ff4d6d" }}>● Support Vectors</span> &nbsp;&nbsp;
        <span style={{ color: "#00ffff" }}>● Prediction</span>
      </div>
    </section>
  );
}
import { useEffect, useRef } from "react";
import * as d3 from "d3";

export default function Visualization({ data, step }) {
  const ref = useRef();

  useEffect(() => {
    if (!data.length || !step) return;

    const width = 600;
    const height = 400;
    const margin = 40;

    const svg = d3.select(ref.current);
    svg.selectAll("*").remove();

    const xScale = d3.scaleLinear()
      .domain(d3.extent(data, d => d.x))
      .range([margin, width - margin]);

    const yScale = d3.scaleLinear()
      .domain(d3.extent(data, d => d.y))
      .range([height - margin, margin]);

    // axes
    svg.append("g")
      .attr("transform", `translate(0,${height - margin})`)
      .call(d3.axisBottom(xScale));

    svg.append("g")
      .attr("transform", `translate(${margin},0)`)
      .call(d3.axisLeft(yScale));

    // data points (animated)
    svg.selectAll(".point")
      .data(data)
      .enter()
      .append("circle")
      .attr("class", "point")
      .attr("cx", d => xScale(d.x))
      .attr("cy", d => yScale(d.y))
      .attr("r", 0)
      .attr("fill", "#d4af37")
      .transition()
      .duration(400)
      .attr("r", 4);

    /* ---------- CURVE ---------- */
    const xValues = d3.range(-5, 5, 0.1);

    const curveData = xValues.map(x => {
      let y = 0;

      // RBF case
      if (step.alpha && step.alpha.length === data.length) {
        step.alpha.forEach((a, i) => {
          const dist = x - data[i].x;
          y += a * Math.exp(-0.5 * dist * dist);
        });
      }

      // Linear fallback
      else if (step.slope !== undefined) {
        y = step.slope * x + step.intercept;
      }

      return { x, y };
    });

    const line = d3.line()
      .x(d => xScale(d.x))
      .y(d => yScale(d.y));

    // main curve
    svg.append("path")
      .datum(curveData)
      .attr("fill", "none")
      .attr("stroke", "#ff4d6d")
      .attr("stroke-width", 2)
      .attr("d", line)
      .attr("opacity", 0)
      .transition()
      .duration(500)
      .attr("opacity", 1);

    /* ---------- EPSILON TUBE ---------- */
    if (step.epsilon !== undefined) {
      const upper = curveData.map(d => ({
        x: d.x,
        y: d.y + step.epsilon
      }));

      const lower = curveData.map(d => ({
        x: d.x,
        y: d.y - step.epsilon
      }));

      svg.append("path")
        .datum(upper)
        .attr("fill", "none")
        .attr("stroke", "#888")
        .attr("stroke-dasharray", "5,5")
        .attr("d", line);

      svg.append("path")
        .datum(lower)
        .attr("fill", "none")
        .attr("stroke", "#888")
        .attr("stroke-dasharray", "5,5")
        .attr("d", line);
    }

    /* ---------- SUPPORT VECTORS ---------- */
    if (step.supportVectors) {
      svg.selectAll(".sv")
        .data(step.supportVectors)
        .enter()
        .append("circle")
        .attr("class", "sv")
        .attr("cx", d => xScale(d.x))
        .attr("cy", d => yScale(d.y))
        .attr("r", 0)
        .attr("fill", "#ff4d6d")
        .transition()
        .duration(400)
        .attr("r", 6);
    }

  }, [data, step]);

  return (
    <div className="card">
      <h3>Model Visualization</h3>
      <svg ref={ref} width={600} height={400}></svg>
    </div>
  );
}
import { useEffect, useRef } from "react";
import * as d3 from "d3";

const CHART_WIDTH = 760;
const CHART_HEIGHT = 420;
const MARGIN = { top: 24, right: 24, bottom: 44, left: 52 };

export default function Visualization({ data, step }) {
  const ref = useRef(null);

  useEffect(() => {
    const svg = d3.select(ref.current);
    svg.selectAll("*").remove();

    if (!data?.length || !step) return;

    const width = CHART_WIDTH;
    const height = CHART_HEIGHT;

    const xMin = d3.min(data, (d) => d.x) ?? -5;
    const xMax = d3.max(data, (d) => d.x) ?? 5;
    const yMin = d3.min(data, (d) => d.y) ?? -1;
    const yMax = d3.max(data, (d) => d.y) ?? 1;

    const xPad = (xMax - xMin || 1) * 0.06;
    const yPad = (yMax - yMin || 1) * 0.15;

    const xScale = d3
      .scaleLinear()
      .domain([xMin - xPad, xMax + xPad])
      .range([MARGIN.left, width - MARGIN.right]);

    const yScale = d3
      .scaleLinear()
      .domain([yMin - yPad, yMax + yPad])
      .range([height - MARGIN.bottom, MARGIN.top]);

    const chart = svg
      .attr("viewBox", `0 0 ${width} ${height}`)
      .attr("preserveAspectRatio", "xMidYMid meet")
      .style("width", "100%")
      .style("height", "auto")
      .append("g");

    const defs = svg.append("defs");
    const glow = defs
      .append("filter")
      .attr("id", "curve-glow")
      .attr("x", "-50%")
      .attr("y", "-50%")
      .attr("width", "200%")
      .attr("height", "200%");

    glow.append("feGaussianBlur").attr("stdDeviation", 2).attr("result", "blur");
    glow
      .append("feMerge")
      .selectAll("feMergeNode")
      .data(["blur", "SourceGraphic"])
      .enter()
      .append("feMergeNode")
      .attr("in", (d) => d);

    chart
      .append("g")
      .attr("class", "grid-lines")
      .attr("transform", `translate(0,${height - MARGIN.bottom})`)
      .call(
        d3
          .axisBottom(xScale)
          .tickSize(-(height - MARGIN.top - MARGIN.bottom))
          .tickFormat("")
      );

    chart
      .append("g")
      .attr("class", "grid-lines")
      .attr("transform", `translate(${MARGIN.left},0)`)
      .call(
        d3
          .axisLeft(yScale)
          .tickSize(-(width - MARGIN.left - MARGIN.right))
          .tickFormat("")
      );

    chart
      .append("g")
      .attr("class", "axis")
      .attr("transform", `translate(0,${height - MARGIN.bottom})`)
      .call(d3.axisBottom(xScale).ticks(8));

    chart
      .append("g")
      .attr("class", "axis")
      .attr("transform", `translate(${MARGIN.left},0)`)
      .call(d3.axisLeft(yScale).ticks(7));

    const xValues = d3.range(xMin - xPad, xMax + xPad, 0.08);
    const curveData = xValues.map((x) => {
      let y = 0;
      if (step.alpha && step.alpha.length === data.length) {
        step.alpha.forEach((a, i) => {
          const dist = x - data[i].x;
          y += a * Math.exp(-0.5 * dist * dist);
        });
      } else if (step.slope !== undefined) {
        y = step.slope * x + (step.intercept ?? 0);
      }
      return { x, y };
    });

    const line = d3
      .line()
      .curve(d3.curveMonotoneX)
      .x((d) => xScale(d.x))
      .y((d) => yScale(d.y));

    chart
      .append("path")
      .datum(curveData)
      .attr("class", "model-curve")
      .attr("d", line)
      .attr("filter", "url(#curve-glow)")
      .attr("stroke-dasharray", function () {
        return `${this.getTotalLength()} ${this.getTotalLength()}`;
      })
      .attr("stroke-dashoffset", function () {
        return this.getTotalLength();
      })
      .transition()
      .duration(650)
      .ease(d3.easeCubicOut)
      .attr("stroke-dashoffset", 0);

    if (step.epsilon !== undefined) {
      const upper = curveData.map((d) => ({ x: d.x, y: d.y + step.epsilon }));
      const lower = curveData.map((d) => ({ x: d.x, y: d.y - step.epsilon }));

      chart.append("path").datum(upper).attr("class", "epsilon-line").attr("d", line);
      chart.append("path").datum(lower).attr("class", "epsilon-line").attr("d", line);
    }

    chart
      .selectAll(".point")
      .data(data)
      .enter()
      .append("circle")
      .attr("class", "point")
      .attr("cx", (d) => xScale(d.x))
      .attr("cy", (d) => yScale(d.y))
      .attr("r", 0)
      .transition()
      .duration(450)
      .attr("r", 4.5);

    if (step.supportVectors?.length) {
      chart
        .selectAll(".sv")
        .data(step.supportVectors)
        .enter()
        .append("circle")
        .attr("class", "sv")
        .attr("cx", (d) => xScale(d.x))
        .attr("cy", (d) => yScale(d.y))
        .attr("r", 0)
        .transition()
        .duration(450)
        .attr("r", 7);
    }

    if (step.predictions?.length) {
      chart
        .selectAll(".pred")
        .data(step.predictions)
        .enter()
        .append("circle")
        .attr("class", "pred")
        .attr("cx", (d) => xScale(d.x))
        .attr("cy", (d) => yScale(d.pred))
        .attr("r", 0)
        .transition()
        .duration(350)
        .attr("r", 3.5);
    }
  }, [data, step]);

  return (
    <section className="viz-panel" aria-label="Model Visualization">
      <div className="viz-header">
        <h3>Model Visualization</h3>
        <span className="viz-chip">SVR Fit + ε Tube</span>
      </div>

      {!data?.length || !step ? (
        <div className="viz-empty">Add data and train to see the model curve.</div>
      ) : (
        <svg ref={ref} className="viz-svg" />
      )}
    </section>
  );
}

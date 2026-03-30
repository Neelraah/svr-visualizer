import { useEffect, useRef } from "react";
import * as d3 from "d3";

export default function LossGraph({ lossHistory }) {
  const ref = useRef();

  useEffect(() => {
    if (!lossHistory.length) return;

    const width = 600;
    const height = 200;

    const svg = d3.select(ref.current);
    svg.selectAll("*").remove();
    

    const x = d3.scaleLinear()
      .domain([0, lossHistory.length])
      .range([0, width]);

    const y = d3.scaleLinear()
      .domain([0, d3.max(lossHistory)])
      .range([height, 0]);

    const line = d3.line()
      .x((d, i) => x(i))
      .y(d => y(d));

    svg.append("path")
      .datum(lossHistory)
      .attr("fill", "none")
     .attr("stroke", "#00ffff")  // bright cyan
    .attr("stroke-width", 2.5)
      .attr("d", line);

      svg.selectAll(".dot")
  .data(lossHistory)
  .enter()
  .append("circle")
  .attr("cx", (d, i) => x(i))
  .attr("cy", d => y(d))
  .attr("r", 3)
  .attr("fill", "#ff4d6d");

  }, [lossHistory]);

  return (
    <div className="card">
      <h3>Training Loss</h3>
      <svg ref={ref} width={600} height={200}></svg>
    </div>
  );
}
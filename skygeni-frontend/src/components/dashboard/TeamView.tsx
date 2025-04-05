import * as d3 from "d3";
import { useEffect, useState } from "react";
import { Team } from "../../types";
import { useTheme } from "@mui/material";
import { ChartContainer } from "../common/ChartContainer";
import {
  setupChartSvg,
  addGridLines,
  createGradient,
  styleAxis,
  formatCurrency,
} from "../../utils/chartUtils";

interface TeamViewProps {
  data: Team;
}

export const TeamView = ({ data }: TeamViewProps) => {
  const [svgRef, setSvgRef] = useState<SVGSVGElement | null>(null);
  const [selectedQuarter, setSelectedQuarter] = useState("2024-Q2");
  const theme = useTheme();

  useEffect(() => {
    if (!svgRef || !data) return;

    const { svg, innerWidth, innerHeight } = setupChartSvg(svgRef);
    const quarterData = data.chartData[selectedQuarter];

    // Sort teams by ACV descending and filter out undefined values
    const teams = [...quarterData.teams]
      .filter(
        (
          team
        ): team is {
          name: string;
          acv: number;
          percentage: number;
          count: number;
        } =>
          team.name !== undefined &&
          team.acv !== undefined &&
          team.percentage !== undefined &&
          team.count !== undefined
      )
      .sort((a, b) => b.acv - a.acv);

    // X and Y scales
    const x = d3
      .scaleBand()
      .domain(teams.map((d) => d.name))
      .range([0, innerWidth])
      .padding(0.3);

    const y = d3
      .scaleLinear()
      .domain([0, d3.max(teams, (d) => d.acv)!])
      .nice()
      .range([innerHeight, 0]);

    // Add grid lines
    addGridLines(svg, y, innerWidth, theme);

    // Create gradient
    createGradient(svg, theme);

    // X axis with styled text
    const xAxis = svg
      .append("g")
      .attr("transform", `translate(0,${innerHeight})`)
      .call(d3.axisBottom(x));
    styleAxis(xAxis, theme);

    // Y axis with styled text
    const yAxis = svg
      .append("g")
      .call(d3.axisLeft(y).tickFormat((d) => formatCurrency(d)));
    styleAxis(yAxis, theme);

    // Draw bars with animation
    svg
      .selectAll(".bar")
      .data(teams)
      .enter()
      .append("rect")
      .attr("class", "bar")
      .attr("x", (d) => x(d.name)!)
      .attr("width", x.bandwidth())
      .attr("y", innerHeight)
      .attr("height", 0)
      .attr("fill", "url(#bar-gradient)")
      .attr("rx", 4)
      .transition()
      .duration(800)
      .attr("y", (d) => y(d.acv))
      .attr("height", (d) => innerHeight - y(d.acv));

    // Add value labels with animation
    svg
      .selectAll(".value-label")
      .data(teams)
      .enter()
      .append("text")
      .attr("class", "value-label")
      .attr("x", (d) => x(d.name)! + x.bandwidth() / 2)
      .attr("y", innerHeight)
      .attr("text-anchor", "middle")
      .style("font-size", "12px")
      .style("font-family", String(theme.typography.fontFamily))
      .style("font-weight", "500")
      .style("opacity", 0)
      .text((d) => formatCurrency(d.acv))
      .transition()
      .duration(800)
      .style("opacity", 1)
      .attr("y", (d) => y(d.acv) - 8);

    // Add percentage labels
    svg
      .selectAll(".percent-label")
      .data(teams)
      .enter()
      .append("text")
      .attr("class", "percent-label")
      .attr("x", (d) => x(d.name)! + x.bandwidth() / 2)
      .attr("y", (d) => y(d.acv) + 20)
      .attr("text-anchor", "middle")
      .style("font-size", "11px")
      .style("font-family", String(theme.typography.fontFamily))
      .style("fill", "white")
      .style("font-weight", "500")
      .text((d) => `${d.percentage}%`);

    // Add count labels (opportunities)
    svg
      .selectAll(".count-label")
      .data(teams)
      .enter()
      .append("text")
      .attr("class", "count-label")
      .attr("x", (d) => x(d.name)! + x.bandwidth() / 2)
      .attr("y", (d) => y(d.acv) + 36)
      .attr("text-anchor", "middle")
      .style("font-size", "11px")
      .style("font-family", String(theme.typography.fontFamily))
      .style("fill", "white")
      .text((d) => `(${d.count} opps)`);
  }, [svgRef, data, selectedQuarter, theme]);

  return (
    <ChartContainer
      title={data?.title}
      quarters={Object.keys(data.chartData)}
      selectedQuarter={selectedQuarter}
      onQuarterChange={setSelectedQuarter}
    >
      <svg ref={setSvgRef}></svg>
    </ChartContainer>
  );
};

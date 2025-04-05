import { Theme } from "@mui/material";
import * as d3 from "d3";

export interface ChartDimensions {
  width: number;
  height: number;
  margin: {
    top: number;
    right: number;
    bottom: number;
    left: number;
  };
}

export const DEFAULT_CHART_DIMENSIONS: ChartDimensions = {
  width: 800,
  height: 400,
  margin: { top: 20, right: 120, bottom: 60, left: 80 },
};

export const formatCurrency = (value: number | d3.NumberValue) => {
  return `$${(Number(value) / 1000).toFixed(0)}K`;
};

export const setupChartSvg = (
  svgRef: SVGSVGElement,
  dimensions: ChartDimensions = DEFAULT_CHART_DIMENSIONS
) => {
  const { width, height, margin } = dimensions;
  const innerWidth = width - margin.left - margin.right;
  const innerHeight = height - margin.top - margin.bottom;

  // Clear previous content
  d3.select(svgRef).selectAll("*").remove();

  const svg = d3
    .select(svgRef)
    .attr("width", width)
    .attr("height", height)
    .append("g")
    .attr("transform", `translate(${margin.left},${margin.top})`);

  return {
    svg,
    innerWidth,
    innerHeight,
  };
};

export const addGridLines = (
  svg: d3.Selection<SVGGElement, unknown, null, undefined>,
  scale: d3.ScaleLinear<number, number>,
  width: number,
  theme: Theme
) => {
  svg
    .append("g")
    .attr("class", "grid")
    .call(
      d3
        .axisLeft(scale)
        .tickSize(-width)
        .tickFormat(() => "")
    )
    .style("stroke", theme.palette.divider)
    .style("stroke-opacity", 0.2)
    .style("stroke-dasharray", "3,3");
};

export const createGradient = (
  svg: d3.Selection<SVGGElement, unknown, null, undefined>,
  theme: Theme,
  id: string = "bar-gradient"
) => {
  const gradient = svg
    .append("defs")
    .append("linearGradient")
    .attr("id", id)
    .attr("gradientTransform", "rotate(90)");

  gradient
    .append("stop")
    .attr("offset", "0%")
    .attr("stop-color", theme.palette.primary.main);

  gradient
    .append("stop")
    .attr("offset", "100%")
    .attr("stop-color", theme.palette.primary.light);

  return gradient;
};

export const styleAxis = (
  selection: d3.Selection<SVGGElement, unknown, null, undefined>,
  theme: Theme
) => {
  selection
    .selectAll("text")
    .style("font-size", "12px")
    .style("font-family", String(theme.typography.fontFamily))
    .style("fill", theme.palette.text.secondary);
};

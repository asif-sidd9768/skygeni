import * as d3 from "d3";
import { useEffect, useState } from "react";
import { Industry } from "../../types";
import {
  Box,
  Typography,
  ButtonGroup,
  Button,
  useTheme,
  alpha,
} from "@mui/material";

interface IndustryViewProps {
  data: Industry;
}

export const IndustryView = ({ data }: IndustryViewProps) => {
  const [svgRef, setSvgRef] = useState<SVGSVGElement | null>(null);
  const [selectedQuarter, setSelectedQuarter] = useState("2024-Q2");
  const theme = useTheme();

  const formatCurrency = (value: number | d3.NumberValue) => {
    return `$${(Number(value) / 1000).toFixed(0)}K`;
  };

  useEffect(() => {
    if (!svgRef || !data) return;

    // Clear previous content
    d3.select(svgRef).selectAll("*").remove();

    const margin = { top: 20, right: 120, bottom: 80, left: 80 };
    const width = 800 - margin.left - margin.right;
    const height = 400 - margin.top - margin.bottom;

    const svg = d3
      .select(svgRef)
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);

    const quarterData = data.chartData[selectedQuarter];

    // Sort data by ACV descending
    const industries = [...quarterData.industries]
      .filter((d) => d.name !== undefined)
      .sort((a, b) => b.acv - a.acv);

    // X and Y scales
    const x = d3
      .scaleBand()
      .domain(industries.map((d) => d.name!))
      .range([0, width])
      .padding(0.3);

    const y = d3
      .scaleLinear()
      .domain([0, d3.max(industries, (d) => d.acv)!])
      .nice()
      .range([height, 0]);

    // X axis with styled text
    svg
      .append("g")
      .attr("transform", `translate(0,${height})`)
      .call(d3.axisBottom(x))
      .selectAll("text")
      .style("text-anchor", "end")
      .style("font-size", "12px")
      .style("font-family", String(theme.typography.fontFamily))
      .style("fill", theme.palette.text.secondary)
      .attr("dx", "-.8em")
      .attr("dy", ".15em")
      .attr("transform", "rotate(-45)");

    // Y axis with styled text
    svg
      .append("g")
      .call(d3.axisLeft(y).tickFormat((d) => formatCurrency(d)))
      .selectAll("text")
      .style("font-size", "12px")
      .style("font-family", String(theme.typography.fontFamily))
      .style("fill", theme.palette.text.secondary);

    // Draw bars with gradient and animation
    const gradient = svg
      .append("defs")
      .append("linearGradient")
      .attr("id", "bar-gradient")
      .attr("gradientTransform", "rotate(90)");

    gradient
      .append("stop")
      .attr("offset", "0%")
      .attr("stop-color", theme.palette.primary.main);

    gradient
      .append("stop")
      .attr("offset", "100%")
      .attr("stop-color", theme.palette.primary.light);

    svg
      .selectAll(".bar")
      .data(industries)
      .enter()
      .append("rect")
      .attr("class", "bar")
      .attr("x", (d) => x(d.name!)!)
      .attr("width", x.bandwidth())
      .attr("y", height)
      .attr("height", 0)
      .attr("fill", "url(#bar-gradient)")
      .attr("rx", 4) // Rounded corners
      .transition()
      .duration(800)
      .attr("y", (d) => y(d.acv))
      .attr("height", (d) => height - y(d.acv));

    // Add value labels with animation
    svg
      .selectAll(".value-label")
      .data(industries)
      .enter()
      .append("text")
      .attr("class", "value-label")
      .attr("x", (d) => x(d.name!)! + x.bandwidth() / 2)
      .attr("y", height)
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
      .data(industries)
      .enter()
      .append("text")
      .attr("class", "percent-label")
      .attr("x", (d) => x(d.name!)! + x.bandwidth() / 2)
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
      .data(industries)
      .enter()
      .append("text")
      .attr("class", "count-label")
      .attr("x", (d) => x(d.name!)! + x.bandwidth() / 2)
      .attr("y", (d) => y(d.acv) + 36)
      .attr("text-anchor", "middle")
      .style("font-size", "11px")
      .style("font-family", String(theme.typography.fontFamily))
      .style("fill", "white")
      .text((d) => `(${d.count} opps)`);

    // Add grid lines
    svg
      .append("g")
      .attr("class", "grid")
      .call(
        d3
          .axisLeft(y)
          .tickSize(-width)
          .tickFormat(() => "")
      )
      .style("stroke", alpha(theme.palette.divider, 0.2))
      .style("stroke-dasharray", "3,3");
  }, [svgRef, data, selectedQuarter, theme]);

  return (
    <Box sx={{ width: "100%" }}>
      <Typography
        variant="h5"
        sx={{
          mb: 3,
          fontWeight: 600,
          textAlign: "center",
          color: theme.palette.text.primary,
        }}
      >
        {data?.title}
      </Typography>

      <Box sx={{ mb: 3, display: "flex", justifyContent: "center" }}>
        <ButtonGroup variant="outlined" size="medium">
          {Object.keys(data!.chartData).map((quarter) => (
            <Button
              key={quarter}
              onClick={() => setSelectedQuarter(quarter)}
              sx={{
                px: 3,
                backgroundColor:
                  selectedQuarter === quarter
                    ? alpha(theme.palette.primary.main, 0.1)
                    : "transparent",
                borderColor:
                  selectedQuarter === quarter
                    ? theme.palette.primary.main
                    : theme.palette.divider,
                color:
                  selectedQuarter === quarter
                    ? theme.palette.primary.main
                    : theme.palette.text.secondary,
                "&:hover": {
                  backgroundColor:
                    selectedQuarter === quarter
                      ? alpha(theme.palette.primary.main, 0.15)
                      : alpha(theme.palette.action.hover, 0.05),
                  borderColor:
                    selectedQuarter === quarter
                      ? theme.palette.primary.main
                      : theme.palette.divider,
                },
              }}
            >
              {quarter}
            </Button>
          ))}
        </ButtonGroup>
      </Box>

      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          "& svg": {
            maxWidth: "100%",
            height: "auto",
          },
        }}
      >
        <svg ref={setSvgRef}></svg>
      </Box>
    </Box>
  );
};

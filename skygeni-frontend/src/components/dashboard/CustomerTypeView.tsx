import * as d3 from "d3";
import { useEffect, useState } from "react";
import { CustomerType, Segment } from "../../types";
import React from "react";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  useTheme,
  alpha,
} from "@mui/material";

interface CustomerViewProps {
  data: CustomerType;
}

export const CustomerView = ({ data }: CustomerViewProps) => {
  const [svgRef, setSvgRef] = useState<SVGSVGElement | null>(null);
  const [pieRef, setPieRef] = useState<SVGSVGElement | null>(null);
  const theme = useTheme();

  // Format currency
  const formatCurrency = (value: number | d3.NumberValue) => {
    return `$${(Number(value) / 1000).toFixed(0)}K`;
  };

  // Draw the bar chart
  useEffect(() => {
    if (!svgRef || !data) return;

    const margin = { top: 20, right: 30, bottom: 60, left: 80 };
    const width = 700 - margin.left - margin.right;
    const height = 400 - margin.top - margin.bottom;

    // Clear any previous content
    d3.select(svgRef).selectAll("*").remove();

    const svg = d3
      .select(svgRef)
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);

    // X scale
    const x = d3
      .scaleBand()
      .domain(data.barChart.map((d) => d.quarter))
      .range([0, width])
      .padding(0.3);

    // Y scale
    const y = d3
      .scaleLinear()
      .domain([0, d3.max(data.barChart, (d) => d.total)!])
      .nice()
      .range([height, 0]);

    // X axis
    svg
      .append("g")
      .attr("transform", `translate(0,${height})`)
      .call(d3.axisBottom(x))
      .selectAll("text")
      .style("text-anchor", "middle")
      .attr("dy", "1em");

    // Y axis
    svg.append("g").call(d3.axisLeft(y).tickFormat((d) => formatCurrency(d)));

    // X axis label
    svg
      .append("text")
      .attr("text-anchor", "middle")
      .attr("x", width / 2)
      .attr("y", height + margin.bottom - 10)
      .style("font-size", "14px")
      .text("Closed Fiscal Quarter");

    // Draw existing customer bars
    svg
      .selectAll(".bar-existing")
      .data(data.barChart)
      .enter()
      .append("rect")
      .attr("class", "bar-existing")
      .attr("x", (d) => x(d.quarter)!)
      .attr("width", x.bandwidth())
      .attr("y", (d) => y(d.existingCustomer.value))
      .attr("height", (d) => height - y(d.existingCustomer.value))
      .attr("fill", "#1E65AC");

    // Draw new customer bars (stacked on top)
    svg
      .selectAll(".bar-new")
      .data(data.barChart)
      .enter()
      .append("rect")
      .attr("class", "bar-new")
      .attr("x", (d) => x(d.quarter)!)
      .attr("width", x.bandwidth())
      .attr("y", (d) => y(d.existingCustomer.value + d.newCustomer.value))
      .attr("height", (d) => height - y(d.newCustomer.value))
      .attr("fill", "#FE8A3D");

    // Add text labels for totals
    svg
      .selectAll(".label-total")
      .data(data.barChart)
      .enter()
      .append("text")
      .attr("class", "label-total")
      .attr("x", (d) => x(d.quarter)! + x.bandwidth() / 2)
      .attr("y", (d) => y(d.total) - 10)
      .attr("text-anchor", "middle")
      .style("font-size", "12px")
      .style("font-weight", "bold")
      .text((d) => formatCurrency(d.total));

    // Add text labels for existing customers
    svg
      .selectAll(".label-existing")
      .data(data.barChart)
      .enter()
      .append("text")
      .attr("class", "label-existing")
      .attr("x", (d) => x(d.quarter)! + x.bandwidth() / 2)
      .attr("y", (d) => y(d.existingCustomer.value) + 20)
      .attr("text-anchor", "middle")
      .style("font-size", "12px")
      .style("fill", "white")
      .text(
        (d) =>
          `${formatCurrency(d.existingCustomer.value)} (${
            d.existingCustomer.percentage
          }%)`
      );

    // Add text labels for new customers
    svg
      .selectAll(".label-new")
      .data(data.barChart)
      .enter()
      .append("text")
      .attr("class", "label-new")
      .attr("x", (d) => x(d.quarter)! + x.bandwidth() / 2)
      .attr("y", (d) => y(d.existingCustomer.value + d.newCustomer.value / 2))
      .attr("text-anchor", "middle")
      .style("font-size", "12px")
      .style("fill", "white")
      .text(
        (d) =>
          `${formatCurrency(d.newCustomer.value)} (${
            d.newCustomer.percentage
          }%)`
      );
  }, [svgRef, data]);

  // Draw the pie chart
  useEffect(() => {
    if (!pieRef || !data) return;

    // Clear any previous content
    d3.select(pieRef).selectAll("*").remove();

    const width = 400;
    const height = 300;
    const radius = Math.min(width, height) / 2;

    const svg = d3
      .select(pieRef)
      .attr("width", width)
      .attr("height", height)
      .append("g")
      .attr("transform", `translate(${width / 2}, ${height / 2})`);

    const color = d3
      .scaleOrdinal<string>()
      .domain(["Existing Customer", "New Customer"])
      .range(["#1E65AC", "#FE8A3D"]);

    const pie = d3
      .pie<Segment>()
      .value((d) => d.value)
      .sort(null);

    const arc = d3
      .arc<d3.PieArcDatum<Segment>>()
      .innerRadius(radius * 0.5)
      .outerRadius(radius * 0.8);

    const outerArc = d3
      .arc<d3.PieArcDatum<Segment>>()
      .innerRadius(radius * 0.9)
      .outerRadius(radius * 0.9);

    // Pie chart segments
    svg
      .selectAll("allSlices")
      .data(pie(data.pieChart.segments))
      .enter()
      .append("path")
      .attr("d", arc)
      .attr("fill", (d) => color(d.data.type))
      .style("opacity", 0.9);

    // Add center text
    svg
      .append("text")
      .attr("text-anchor", "middle")
      .attr("dy", "-0.5em")
      .style("font-size", "12px")
      .text("Total");

    svg
      .append("text")
      .attr("text-anchor", "middle")
      .attr("dy", "1em")
      .style("font-size", "14px")
      .style("font-weight", "bold")
      .text(`$${(data.pieChart.total / 1000000).toFixed(3)}M`);

    // Add labels with lines
    const segments = pie(data.pieChart.segments);
    segments.forEach((segment) => {
      const pos = outerArc.centroid(segment);
      const midAngle =
        segment.startAngle + (segment.endAngle - segment.startAngle) / 2;
      pos[0] = radius * 0.95 * (midAngle < Math.PI ? 1 : -1);

      // Percentage and value
      svg
        .append("text")
        .attr("x", pos[0] + (midAngle < Math.PI ? 5 : -5))
        .attr("y", pos[1])
        .attr("text-anchor", midAngle < Math.PI ? "start" : "end")
        .style("font-size", "12px")
        .text(
          `$${(segment.data.value / 1000000).toFixed(3)}M (${
            segment.data.percentage
          }%)`
        );

      // Connect with polylines
      const posA = arc.centroid(segment);
      const posB = outerArc.centroid(segment);
      const posC = outerArc.centroid(segment);
      posC[0] = radius * 0.95 * (midAngle < Math.PI ? 1 : -1);

      svg
        .append("polyline")
        .attr("points", `${posA}, ${posB}, ${posC}`)
        .style("fill", "none")
        .style("stroke", "gray")
        .style("stroke-width", 1);
    });
  }, [pieRef, data]);

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

      <Box
        sx={{
          display: "flex",
          flexDirection: { xs: "column", lg: "row" },
          gap: 3,
          mb: 4,
        }}
      >
        <Box sx={{ flex: { xs: "1", lg: "2" } }}>
          <Card
            elevation={2}
            sx={{
              height: "100%",
              background: alpha(theme.palette.background.paper, 0.8),
              backdropFilter: "blur(8px)",
              borderRadius: 2,
            }}
          >
            <CardContent>
              <Typography variant="h6" sx={{ mb: 2 }}>
                Won ACV Mix by Quarter
              </Typography>
              <Box sx={{ display: "flex", justifyContent: "center" }}>
                <svg ref={setSvgRef}></svg>
              </Box>
            </CardContent>
          </Card>
        </Box>

        <Box sx={{ flex: { xs: "1", lg: "1" } }}>
          <Card
            elevation={2}
            sx={{
              height: "100%",
              background: alpha(theme.palette.background.paper, 0.8),
              backdropFilter: "blur(8px)",
              borderRadius: 2,
            }}
          >
            <CardContent>
              <Typography variant="h6" sx={{ mb: 2 }}>
                Customer Distribution
              </Typography>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "center",
                }}
              >
                <svg ref={setPieRef}></svg>
              </Box>
            </CardContent>
          </Card>
        </Box>
      </Box>

      <Card
        elevation={2}
        sx={{
          background: alpha(theme.palette.background.paper, 0.8),
          backdropFilter: "blur(8px)",
          borderRadius: 2,
        }}
      >
        <CardContent>
          <Typography variant="h6" sx={{ mb: 2 }}>
            Detailed Performance Metrics
          </Typography>
          <TableContainer
            component={Paper}
            sx={{
              boxShadow: "none",
              "& .MuiTable-root": {
                borderCollapse: "separate",
                borderSpacing: "0 2px",
              },
            }}
          >
            <Table size="medium">
              <TableHead>
                <TableRow>
                  <TableCell
                    sx={{
                      fontWeight: 600,
                      fontSize: "0.95rem",
                      borderBottom: `2px solid ${theme.palette.divider}`,
                      backgroundColor: alpha(theme.palette.primary.main, 0.04),
                      width: "15%",
                    }}
                  >
                    Cust Type
                  </TableCell>
                  {data?.table.headers.slice(1, -1).map((header, idx) => (
                    <React.Fragment key={idx}>
                      <TableCell
                        colSpan={3}
                        align="center"
                        sx={{
                          fontWeight: 600,
                          fontSize: "0.95rem",
                          borderBottom: `2px solid ${theme.palette.divider}`,
                          backgroundColor: alpha(
                            theme.palette.primary.main,
                            0.04
                          ),
                        }}
                      >
                        {typeof header === "string" ? header : header.quarter}
                        <Box
                          sx={{
                            display: "flex",
                            mt: 1,
                            "& > *": {
                              flex: 1,
                              color: theme.palette.text.secondary,
                              fontWeight: 500,
                            },
                          }}
                        >
                          <Typography
                            variant="caption"
                            sx={{ textAlign: "center" }}
                          >
                            Opps
                          </Typography>
                          <Typography
                            variant="caption"
                            sx={{ textAlign: "center" }}
                          >
                            ACV
                          </Typography>
                          <Typography
                            variant="caption"
                            sx={{ textAlign: "center" }}
                          >
                            %
                          </Typography>
                        </Box>
                      </TableCell>
                    </React.Fragment>
                  ))}
                  <TableCell
                    colSpan={3}
                    align="center"
                    sx={{
                      fontWeight: 600,
                      fontSize: "0.95rem",
                      borderBottom: `2px solid ${theme.palette.divider}`,
                      backgroundColor: alpha(theme.palette.primary.main, 0.04),
                    }}
                  >
                    Total
                    <Box
                      sx={{
                        display: "flex",
                        mt: 1,
                        "& > *": {
                          flex: 1,
                          color: theme.palette.text.secondary,
                          fontWeight: 500,
                        },
                      }}
                    >
                      <Typography
                        variant="caption"
                        sx={{ textAlign: "center" }}
                      >
                        Opps
                      </Typography>
                      <Typography
                        variant="caption"
                        sx={{ textAlign: "center" }}
                      >
                        ACV
                      </Typography>
                      <Typography
                        variant="caption"
                        sx={{ textAlign: "center" }}
                      >
                        %
                      </Typography>
                    </Box>
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {data?.table.rows.map((row, rowIdx) => (
                  <TableRow
                    key={rowIdx}
                    sx={{
                      "&:nth-of-type(odd)": {
                        backgroundColor: alpha(
                          theme.palette.action.hover,
                          0.02
                        ),
                      },
                      "&:hover": {
                        backgroundColor: alpha(
                          theme.palette.action.hover,
                          0.08
                        ),
                      },
                      transition: "background-color 0.2s ease",
                    }}
                  >
                    <TableCell
                      sx={{
                        fontWeight: 500,
                        fontSize: "0.875rem",
                        color: theme.palette.text.primary,
                        borderBottom: `1px solid ${alpha(
                          theme.palette.divider,
                          0.5
                        )}`,
                      }}
                    >
                      {row.custType}
                    </TableCell>
                    {row.quarters.map((quarter, qIdx) => (
                      <React.Fragment key={qIdx}>
                        <TableCell
                          align="center"
                          sx={{
                            borderBottom: `1px solid ${alpha(
                              theme.palette.divider,
                              0.5
                            )}`,
                            fontSize: "0.875rem",
                          }}
                        >
                          {quarter.oppCount}
                        </TableCell>
                        <TableCell
                          align="right"
                          sx={{
                            borderBottom: `1px solid ${alpha(
                              theme.palette.divider,
                              0.5
                            )}`,
                            fontSize: "0.875rem",
                            color: theme.palette.primary.main,
                            fontWeight: 500,
                          }}
                        >
                          {formatCurrency(quarter.acv)}
                        </TableCell>
                        <TableCell
                          align="center"
                          sx={{
                            borderBottom: `1px solid ${alpha(
                              theme.palette.divider,
                              0.5
                            )}`,
                            fontSize: "0.875rem",
                          }}
                        >
                          {quarter.percentage}%
                        </TableCell>
                      </React.Fragment>
                    ))}
                    <TableCell
                      align="center"
                      sx={{
                        fontWeight: 600,
                        fontSize: "0.875rem",
                        borderBottom: `1px solid ${alpha(
                          theme.palette.divider,
                          0.5
                        )}`,
                      }}
                    >
                      {row.total.oppCount}
                    </TableCell>
                    <TableCell
                      align="right"
                      sx={{
                        fontWeight: 600,
                        fontSize: "0.875rem",
                        color: theme.palette.primary.main,
                        borderBottom: `1px solid ${alpha(
                          theme.palette.divider,
                          0.5
                        )}`,
                      }}
                    >
                      {formatCurrency(row.total.acv)}
                    </TableCell>
                    <TableCell
                      align="center"
                      sx={{
                        fontWeight: 600,
                        fontSize: "0.875rem",
                        borderBottom: `1px solid ${alpha(
                          theme.palette.divider,
                          0.5
                        )}`,
                      }}
                    >
                      {row.total.percentage}%
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>
    </Box>
  );
};

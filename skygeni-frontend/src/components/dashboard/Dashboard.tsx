/**
 * Dashboard Component
 *
 * Main dashboard component that manages the display of various sales performance views:
 * - Customer Type Analysis
 * - Industry Distribution
 * - ACV Range Analysis
 * - Team Performance
 *
 * Features:
 * - Tab-based navigation between different views
 * - Loading state handling
 * - Responsive layout
 * - Gradient text styling for the header
 */

import { useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import { CustomerView } from "./CustomerTypeView";
import { IndustryView } from "./IndustryView";
import { AcvRangeView } from "./ACVRangeView";
import { TeamView } from "./TeamView";
import { DashboardTabs } from "../common/DashboardTabs";
import { TabPanel } from "../common/TabPanel";
import {
  Box,
  Typography,
  CircularProgress,
  Container,
  useTheme,
} from "@mui/material";

export const Dashboard = () => {
  // State management for active tab selection
  const [activeTab, setActiveTab] = useState("customerType");

  // Get dashboard data and loading state from Redux store
  const { dashboardStats, loading } = useSelector(
    (state: RootState) => state.dashboard
  );

  // Access theme for gradient text styling
  const theme = useTheme();

  // Handler for tab change events
  const handleTabChange = (_: React.SyntheticEvent, newValue: string) => {
    setActiveTab(newValue);
  };

  // Display loading spinner while data is being fetched
  if (loading) {
    return (
      <Box
        display="flex"
        flexDirection="column"
        justifyContent="center"
        alignItems="center"
        minHeight="80vh"
        gap={2}
      >
        <CircularProgress size={40} thickness={4} />
        <Typography variant="h6" color="text.secondary">
          Loading dashboard data...
        </Typography>
      </Box>
    );
  }

  return (
    <Container maxWidth="xl">
      <Box sx={{ pt: 4, pb: 8 }}>
        {/* Dashboard Header with gradient text effect */}
        <Typography
          variant="h3"
          component="h1"
          align="center"
          sx={{
            mb: 6,
            fontWeight: 700,
            background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}
        >
          Sales Performance Dashboard
        </Typography>

        {/* Tab navigation */}
        <DashboardTabs activeTab={activeTab} onTabChange={handleTabChange} />

        {/* Customer Type Analysis Tab */}
        <TabPanel value="customerType" activeTab={activeTab}>
          {dashboardStats?.customerType && (
            <CustomerView data={dashboardStats.customerType} />
          )}
        </TabPanel>

        {/* Industry Distribution Tab */}
        <TabPanel value="industry" activeTab={activeTab}>
          {dashboardStats?.industry && (
            <IndustryView data={dashboardStats.industry} />
          )}
        </TabPanel>

        {/* ACV Range Analysis Tab */}
        <TabPanel value="acvRange" activeTab={activeTab}>
          {dashboardStats?.acvRange && (
            <AcvRangeView data={dashboardStats.acvRange} />
          )}
        </TabPanel>

        {/* Team Performance Tab */}
        <TabPanel value="team" activeTab={activeTab}>
          {dashboardStats?.team && <TeamView data={dashboardStats.team} />}
        </TabPanel>
      </Box>
    </Container>
  );
};

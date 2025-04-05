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
  const [activeTab, setActiveTab] = useState("customerType");
  const { dashboardStats, loading } = useSelector(
    (state: RootState) => state.dashboard
  );
  const theme = useTheme();

  const handleTabChange = (_: React.SyntheticEvent, newValue: string) => {
    setActiveTab(newValue);
  };

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

        <DashboardTabs activeTab={activeTab} onTabChange={handleTabChange} />

        <TabPanel value="customerType" activeTab={activeTab}>
          {dashboardStats?.customerType && (
            <CustomerView data={dashboardStats.customerType} />
          )}
        </TabPanel>

        <TabPanel value="industry" activeTab={activeTab}>
          {dashboardStats?.industry && (
            <IndustryView data={dashboardStats.industry} />
          )}
        </TabPanel>

        <TabPanel value="acvRange" activeTab={activeTab}>
          {dashboardStats?.acvRange && (
            <AcvRangeView data={dashboardStats.acvRange} />
          )}
        </TabPanel>

        <TabPanel value="team" activeTab={activeTab}>
          {dashboardStats?.team && <TeamView data={dashboardStats.team} />}
        </TabPanel>
      </Box>
    </Container>
  );
};

import { Paper, Tabs, Tab, alpha, useTheme } from "@mui/material";

interface DashboardTabsProps {
  activeTab: string;
  onTabChange: (event: React.SyntheticEvent, newValue: string) => void;
}

export const DashboardTabs = ({
  activeTab,
  onTabChange,
}: DashboardTabsProps) => {
  const theme = useTheme();

  return (
    <Paper
      elevation={2}
      sx={{
        mb: 4,
        borderRadius: 2,
        background: alpha(theme.palette.background.paper, 0.8),
        backdropFilter: "blur(8px)",
      }}
    >
      <Tabs
        value={activeTab}
        onChange={onTabChange}
        variant="fullWidth"
        sx={{
          "& .MuiTabs-indicator": {
            height: 3,
            borderRadius: "3px 3px 0 0",
          },
          "& .MuiTab-root": {
            fontSize: "1rem",
            textTransform: "none",
            fontWeight: 500,
            py: 2,
            "&.Mui-selected": {
              fontWeight: 600,
            },
          },
        }}
      >
        <Tab value="customerType" label="Customer Type" />
        <Tab value="industry" label="Industry" />
        <Tab value="acvRange" label="Deal Size" />
        <Tab value="team" label="Team" />
      </Tabs>
    </Paper>
  );
};

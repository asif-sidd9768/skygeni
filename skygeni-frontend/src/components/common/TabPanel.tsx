import { Box, Paper, alpha, useTheme } from "@mui/material";
import { ReactNode } from "react";

interface TabPanelProps {
  children?: ReactNode;
  value: string;
  activeTab: string;
}

export const TabPanel = ({ children, value, activeTab }: TabPanelProps) => {
  const theme = useTheme();

  return (
    <Box
      role="tabpanel"
      hidden={value !== activeTab}
      id={`tabpanel-${value}`}
      aria-labelledby={`tab-${value}`}
    >
      {value === activeTab && (
        <Paper
          elevation={3}
          sx={{
            p: 4,
            borderRadius: 3,
            background: alpha(theme.palette.background.paper, 0.8),
            backdropFilter: "blur(8px)",
          }}
        >
          {children}
        </Paper>
      )}
    </Box>
  );
};

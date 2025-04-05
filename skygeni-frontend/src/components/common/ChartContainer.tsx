import {
  Box,
  Typography,
  ButtonGroup,
  Button,
  useTheme,
  alpha,
} from "@mui/material";
import { ReactNode } from "react";

interface ChartContainerProps {
  title?: string;
  quarters?: string[];
  selectedQuarter?: string;
  onQuarterChange?: (quarter: string) => void;
  children: ReactNode;
}

export const ChartContainer = ({
  title,
  quarters,
  selectedQuarter,
  onQuarterChange,
  children,
}: ChartContainerProps) => {
  const theme = useTheme();

  return (
    <Box sx={{ width: "100%" }}>
      {title && (
        <Typography
          variant="h5"
          sx={{
            mb: 3,
            fontWeight: 600,
            textAlign: "center",
            color: theme.palette.text.primary,
          }}
        >
          {title}
        </Typography>
      )}

      {quarters && selectedQuarter && onQuarterChange && (
        <Box sx={{ mb: 3, display: "flex", justifyContent: "center" }}>
          <ButtonGroup variant="outlined" size="medium">
            {quarters.map((quarter) => (
              <Button
                key={quarter}
                onClick={() => onQuarterChange(quarter)}
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
      )}

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
        {children}
      </Box>
    </Box>
  );
};

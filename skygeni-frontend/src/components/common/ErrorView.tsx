/**
 * ErrorView Component
 *
 * A reusable component for displaying error states in the application.
 * Features a modern design with a frosted glass effect, error icon,
 * customizable message, and an optional retry button.
 */

import { Box, Typography, Button, Paper, alpha, useTheme } from "@mui/material";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import RefreshIcon from "@mui/icons-material/Refresh";

interface ErrorViewProps {
  /** Custom error message to display. Defaults to a generic error message if not provided */
  message?: string;
  /** Optional callback function to handle retry attempts */
  onRetry?: () => void;
}

export const ErrorView = ({
  message = "An error occurred while loading the data.",
  onRetry,
}: ErrorViewProps) => {
  const theme = useTheme();

  return (
    // Container with centered content
    <Box
      display="flex"
      flexDirection="column"
      justifyContent="center"
      alignItems="center"
      minHeight="50vh"
    >
      {/* Error card with frosted glass effect */}
      <Paper
        elevation={2}
        sx={{
          p: 4,
          borderRadius: 3,
          background: alpha(theme.palette.background.paper, 0.8),
          backdropFilter: "blur(8px)",
          textAlign: "center",
          maxWidth: 400,
        }}
      >
        {/* Error icon */}
        <ErrorOutlineIcon
          sx={{
            fontSize: 64,
            color: theme.palette.error.main,
            mb: 2,
          }}
        />

        {/* Error title */}
        <Typography
          variant="h5"
          component="h2"
          color="error"
          sx={{ mb: 2, fontWeight: 600 }}
        >
          Oops! Something went wrong
        </Typography>

        {/* Error message */}
        <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
          {message}
        </Typography>

        {/* Retry button - only shown if onRetry callback is provided */}
        {onRetry && (
          <Button
            variant="contained"
            color="primary"
            onClick={onRetry}
            startIcon={<RefreshIcon />}
            sx={{
              px: 4,
              py: 1,
              borderRadius: 2,
              textTransform: "none",
              fontWeight: 500,
            }}
          >
            Try Again
          </Button>
        )}
      </Paper>
    </Box>
  );
};

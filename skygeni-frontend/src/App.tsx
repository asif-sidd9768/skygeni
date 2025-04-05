/**
 * App Component
 *
 * Root component of the application that handles:
 * - Initial data fetching
 * - Error handling and display
 * - Layout structure
 * - Theme configuration
 */

import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "./redux/store";
import { useEffect } from "react";
import { fetchDashboardData } from "./redux/dashboardSlice";
import { Dashboard } from "./components/dashboard/Dashboard.tsx";
import { ErrorView } from "./components/common/ErrorView";
import { CssBaseline, Container, Box } from "@mui/material";

function App() {
  // Get error state from Redux store
  const { error } = useSelector((state: RootState) => state.dashboard);
  const dispatch = useDispatch<AppDispatch>();

  // Fetch dashboard data on component mount
  useEffect(() => {
    dispatch(fetchDashboardData());
  }, [dispatch]);

  // Handler for retry attempts when data fetch fails
  const handleRetry = () => {
    dispatch(fetchDashboardData());
  };

  return (
    <>
      <CssBaseline />
      <Box sx={{ minHeight: "100vh", bgcolor: "background.default" }}>
        <Container maxWidth="xl" sx={{ py: 4 }}>
          {error ? (
            <ErrorView message={error} onRetry={handleRetry} />
          ) : (
            <Dashboard />
          )}
        </Container>
      </Box>
    </>
  );
}

export default App;

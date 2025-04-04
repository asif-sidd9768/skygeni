import { useDispatch, useSelector } from "react-redux";
import { RootState } from "./redux/store";
import Button from "@mui/material/Button";
import { useEffect } from "react";
import { fetchDashboardData } from "./redux/dashboardSlice";

function App() {
  const { dashboardStats } = useSelector((state: RootState) => state.dashboard);
  const dispatch = useDispatch();

  console.log("dashboardStats", dashboardStats);

  useEffect(() => {
    dispatch(fetchDashboardData());
  }, []);

  return (
    <div className="p-12">
      <h1 className="text-blue-600 text-3xl">React:</h1>
      <Button variant="contained">Hello world</Button>
    </div>
  );
}

export default App;

import axios from "axios";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { DashboardData } from "../types";
import API_BASE_URL from "../utils/api";

interface initialStateType {
  dashboardStats: DashboardData | null;
  loading: boolean;
  error: string | null;
}

const initialState: initialStateType = {
  dashboardStats: null,
  loading: false,
  error: null,
};

export const fetchDashboardData = createAsyncThunk<DashboardData>(
  "dashboard/fetchDashboardData",
  async () => {
    const response = await axios.get(`${API_BASE_URL}/dashboard`);
    return response.data.data;
  }
);

const dashboardSlice = createSlice({
  name: "dashboard",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchDashboardData.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchDashboardData.fulfilled, (state, action) => {
        state.loading = false;
        state.dashboardStats = action.payload;
      })
      .addCase(fetchDashboardData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to fetch data";
      });
  },
});

export default dashboardSlice.reducer;

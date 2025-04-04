import axios from "axios";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

export interface ApiResponse {
  data: DashboardData;
  message: string;
  status: string;
}

export interface DashboardData {
  Account: AccountType[];
  ACV: ACVType[];
  Customer: CustomerType[];
  Team: TeamType[];
}

interface AccountType {
  count: number;
  acv: number;
  closed_fiscal_quarter: string;
  Acct_Industry: string;
  query_key: string;
}

interface ACVType {
  count: number;
  acv: number;
  closed_fiscal_quarter: string;
  ACV_Range: string;
}

interface CustomerType {
  count: number;
  acv: number;
  closed_fiscal_quarter: string;
  Cust_Type: string;
}

interface TeamType {
  count: number;
  acv: number;
  closed_fiscal_quarter: string;
  Team: string;
}

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
    const response = await axios.get("http://localhost:3000/api/dashboard");
    console.log("response", response.data.data);
    return response.data;
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

// export const { increment, decrement, reset } = dashboardSlice.actions;
export default dashboardSlice.reducer;

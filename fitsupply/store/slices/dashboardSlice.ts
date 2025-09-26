import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "@/store";
import api from "@/lib/apiClient";

interface DashboardSummary {
  total_sales: number;
  new_orders: number;
  new_customers: number;
}

interface Order {
  id: number;
  customer_name: string;
  total: number;
  status: string;
  created_at: string;
}

interface SalesDataPoint {
  date: string;
  sales: number;
}

interface DashboardState {
  summary: DashboardSummary | null;
  recentOrders: Order[];
  salesChartData: SalesDataPoint[];
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
}

const initialState: DashboardState = {
  summary: null,
  recentOrders: [],
  salesChartData: [],
  status: "idle",
  error: null,
};

export const fetchDashboardSummary = createAsyncThunk(
  "dashboard/fetchSummary",
  async (_, { getState, rejectWithValue }) => {
    try {
      const state = getState() as RootState;
      const token = state.auth.token;

      if (!token) {
        return rejectWithValue("Authentication token not found.");
      }

      // Use api client which handles the base URL and auth headers
      const response = await api.get("/dashboard/summary/");
      return response.data as DashboardSummary;
    } catch (error: any) {
      console.error("Dashboard summary error:", error.response?.data);
      return rejectWithValue(
        error.response?.data?.detail || "Failed to fetch dashboard summary."
      );
    }
  }
);

export const fetchRecentOrders = createAsyncThunk(
  "dashboard/fetchRecentOrders",
  async (_, { getState, rejectWithValue }) => {
    try {
      const state = getState() as RootState;
      const token = state.auth.token;

      if (!token) {
        return rejectWithValue("Authentication token not found.");
      }

      const response = await api.get("/dashboard/recent-orders/");
      return response.data as Order[];
    } catch (error: any) {
      console.error("Recent orders error:", error.response?.data);
      return rejectWithValue(
        error.response?.data?.detail || "Failed to fetch recent orders."
      );
    }
  }
);

export const fetchSalesChartData = createAsyncThunk(
  "dashboard/fetchSalesChartData",
  async (_, { getState, rejectWithValue }) => {
    try {
      const state = getState() as RootState;
      const token = state.auth.token;

      if (!token) {
        return rejectWithValue("Authentication token not found.");
      }

      const response = await api.get("/dashboard/sales-chart/");
      return response.data as SalesDataPoint[];
    } catch (error: any) {
      console.error("Sales chart error:", error.response?.data);
      return rejectWithValue(
        error.response?.data?.detail || "Failed to fetch sales chart data."
      );
    }
  }
);

const dashboardSlice = createSlice({
  name: "dashboard",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    resetDashboard: (state) => {
      state.summary = null;
      state.recentOrders = [];
      state.salesChartData = [];
      state.status = "idle";
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Dashboard Summary
      .addCase(fetchDashboardSummary.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchDashboardSummary.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.summary = action.payload;
        state.error = null;
      })
      .addCase(fetchDashboardSummary.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload as string;
      })

      // Recent Orders
      .addCase(fetchRecentOrders.pending, (state) => {
        // Don't change main status for individual component loads
      })
      .addCase(fetchRecentOrders.fulfilled, (state, action) => {
        state.recentOrders = action.payload;
      })
      .addCase(fetchRecentOrders.rejected, (state, action) => {
        console.error("Failed to fetch recent orders:", action.payload);
        // Don't set main error state for component-level failures
      })

      // Sales Chart Data
      .addCase(fetchSalesChartData.pending, (state) => {
        // Don't change main status for individual component loads
      })
      .addCase(fetchSalesChartData.fulfilled, (state, action) => {
        state.salesChartData = action.payload;
      })
      .addCase(fetchSalesChartData.rejected, (state, action) => {
        console.error("Failed to fetch sales chart data:", action.payload);
        // Don't set main error state for component-level failures
      });
  },
});

export const { clearError, resetDashboard } = dashboardSlice.actions;
export default dashboardSlice.reducer;

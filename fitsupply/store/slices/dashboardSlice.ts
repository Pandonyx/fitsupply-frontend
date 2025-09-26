import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "@/store";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

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
    const token = (getState() as RootState).auth.token;
    if (!token) return rejectWithValue("Authentication token not found.");

    try {
      // Assuming your backend has an endpoint for dashboard analytics
      const response = await fetch(`${API_BASE_URL}api/v1/dashboard/summary/`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!response.ok) throw new Error("Failed to fetch dashboard summary.");
      return (await response.json()) as DashboardSummary;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchRecentOrders = createAsyncThunk(
  "dashboard/fetchRecentOrders",
  async (_, { getState, rejectWithValue }) => {
    const token = (getState() as RootState).auth.token;
    if (!token) return rejectWithValue("Authentication token not found.");

    try {
      const response = await fetch(
        `${API_BASE_URL}api/v1/dashboard/recent-orders/`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      if (!response.ok) throw new Error("Failed to fetch recent orders.");
      return (await response.json()) as Order[];
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchSalesChartData = createAsyncThunk(
  "dashboard/fetchSalesChartData",
  async (_, { getState, rejectWithValue }) => {
    const token = (getState() as RootState).auth.token;
    if (!token) return rejectWithValue("Authentication token not found.");

    try {
      const response = await fetch(
        `${API_BASE_URL}api/v1/dashboard/sales-chart/`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      if (!response.ok) {
        throw new Error("Failed to fetch sales chart data.");
      }
      return (await response.json()) as SalesDataPoint[];
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

const dashboardSlice = createSlice({
  name: "dashboard",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchDashboardSummary.pending, (state) => {
        state.status = "loading";
      })
      .addCase(
        fetchDashboardSummary.fulfilled,
        (state, action: PayloadAction<DashboardSummary>) => {
          state.status = "succeeded";
          state.summary = action.payload;
        }
      )
      .addCase(fetchDashboardSummary.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload as string;
      })
      .addCase(fetchRecentOrders.fulfilled, (state, action) => {
        state.recentOrders = action.payload;
      })
      .addCase(fetchRecentOrders.rejected, (state, action) => {
        // Log error but don't block the whole page
        console.error("Failed to fetch recent orders:", action.payload);
      })
      .addCase(fetchSalesChartData.fulfilled, (state, action) => {
        state.salesChartData = action.payload;
      })
      .addCase(fetchSalesChartData.rejected, (state, action) => {
        // Log error but don't block the whole page
        console.error("Failed to fetch sales chart data:", action.payload);
      });
  },
});

export default dashboardSlice.reducer;

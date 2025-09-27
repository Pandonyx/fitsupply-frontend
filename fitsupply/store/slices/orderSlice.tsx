import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "@/lib/apiClient";

interface OrderItem {
  id: number;
  product: {
    id: number;
    name: string;
    price: string;
    image?: string;
  };
  quantity: number;
  price: string;
}

interface Order {
  id: number;
  order_number: string;
  status: string;
  total_amount: string;
  created_at: string;
  items: OrderItem[];
}

interface OrderState {
  orders: Order[];
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
}

const initialState: OrderState = {
  orders: [],
  status: "idle",
  error: null,
};

// Fetch user's order history
export const fetchUserOrders = createAsyncThunk<
  Order[],
  void,
  { rejectValue: string }
>("orders/fetchUserOrders", async (_, { rejectWithValue }) => {
  try {
    const response = await api.get("orders/");
    return response.data.results || response.data;
  } catch (error: any) {
    return rejectWithValue(
      error.response?.data?.detail || "Failed to fetch orders"
    );
  }
});

const orderSlice = createSlice({
  name: "orders",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUserOrders.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchUserOrders.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.orders = action.payload;
        state.error = null;
      })
      .addCase(fetchUserOrders.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload || "Failed to fetch orders";
      });
  },
});

export const { clearError } = orderSlice.actions;
export default orderSlice.reducer;

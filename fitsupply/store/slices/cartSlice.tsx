import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import api from "@/lib/apiClient";
import { RootState } from "@/store";

export interface CartItem {
  productId: string;
  name: string;
  price: string;
  image?: string;
  qty: number;
}

interface CartState {
  items: CartItem[];
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
}

const initialState: CartState = {
  items: [],
  status: "idle",
  error: null,
};

// Async thunks for API integration
export const fetchCart = createAsyncThunk<
  CartItem[],
  void,
  { state: RootState; rejectValue: string }
>("cart/fetchCart", async (_, { getState, rejectWithValue }) => {
  try {
    const state = getState();
    const token = state.auth.token;
    if (!token) return rejectWithValue("No authentication token");

    const response = await api.get("/cart/");
    return response.data.items || [];
  } catch (error: any) {
    return rejectWithValue(
      error.response?.data?.detail || "Failed to fetch cart"
    );
  }
});

export const saveCart = createAsyncThunk<
  void,
  void,
  { state: RootState; rejectValue: string }
>("cart/saveCart", async (_, { getState, rejectWithValue }) => {
  try {
    const state = getState();
    const { items } = state.cart;
    const token = state.auth.token;

    if (!token) return rejectWithValue("No authentication token");

    await api.post("/cart/", { items });
  } catch (error: any) {
    return rejectWithValue(
      error.response?.data?.detail || "Failed to save cart"
    );
  }
});

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addToCart: (state, action: PayloadAction<CartItem>) => {
      const existingItem = state.items.find(
        (item) => item.productId === action.payload.productId
      );

      if (existingItem) {
        existingItem.qty += action.payload.qty;
      } else {
        state.items.push(action.payload);
      }
    },
    removeFromCart: (state, action: PayloadAction<string>) => {
      state.items = state.items.filter(
        (item) => item.productId !== action.payload
      );
    },
    updateQty: (state, action: PayloadAction<{ id: string; qty: number }>) => {
      const item = state.items.find(
        (item) => item.productId === action.payload.id
      );
      if (item && action.payload.qty > 0) {
        item.qty = action.payload.qty;
      }
    },
    clearCart: (state) => {
      state.items = [];
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCart.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchCart.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.items = action.payload;
        state.error = null;
      })
      .addCase(fetchCart.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload || "Failed to fetch cart";
      })
      .addCase(saveCart.pending, (state) => {
        // Don't change status for save operations
      })
      .addCase(saveCart.fulfilled, (state) => {
        state.error = null;
      })
      .addCase(saveCart.rejected, (state, action) => {
        state.error = action.payload || "Failed to save cart";
      });
  },
});

export const { addToCart, removeFromCart, updateQty, clearCart } =
  cartSlice.actions;
export default cartSlice.reducer;

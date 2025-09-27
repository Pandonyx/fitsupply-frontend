import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import api from "@/lib/apiClient";

interface CartItem {
  id: number;
  product: {
    id: number;
    name: string;
    price: string;
    slug: string;
    image?: string;
  };
  quantity: number;
  total_price: string;
}

interface CartState {
  items: CartItem[];
  total: string;
  itemCount: number; // Add this for header display
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
}

const initialState: CartState = {
  items: [],
  total: "0.00",
  itemCount: 0,
  status: "idle",
  error: null,
};

// Helper function to safely calculate totals
const calculateCartTotals = (items: CartItem[]) => {
  let total = 0;
  let itemCount = 0;

  items.forEach((item) => {
    const itemTotal = parseFloat(item.total_price) || 0;
    const quantity = item.quantity || 0;

    total += itemTotal;
    itemCount += quantity;
  });

  return {
    total: total.toFixed(2),
    itemCount,
  };
};

// Fetch cart from Django
export const fetchCart = createAsyncThunk<
  { items: CartItem[]; total: string },
  void,
  { rejectValue: string }
>("cart/fetchCart", async (_, { rejectWithValue }) => {
  try {
    const response = await api.get("cart/");
    const items = response.data.items || [];

    // Calculate totals from items to ensure consistency
    const { total } = calculateCartTotals(items);

    return {
      items,
      total: response.data.total_price || total, // Use backend total if available, fallback to calculated
    };
  } catch (error: any) {
    return rejectWithValue(
      error.response?.data?.detail || "Failed to fetch cart"
    );
  }
});

// Add item to cart using Django's add endpoint
export const addToCart = createAsyncThunk<
  { items: CartItem[]; total: string },
  { productId: number; quantity: number },
  { rejectValue: string }
>("cart/addToCart", async ({ productId, quantity }, { rejectWithValue }) => {
  try {
    const response = await api.post("cart/add/", {
      product_id: productId,
      quantity: quantity,
    });

    const items = response.data.items || [];
    const { total } = calculateCartTotals(items);

    return {
      items,
      total: response.data.total_price || total,
    };
  } catch (error: any) {
    return rejectWithValue(
      error.response?.data?.detail || "Failed to add item to cart"
    );
  }
});

// Update cart item quantity
export const updateCartItem = createAsyncThunk<
  CartItem,
  { itemId: number; quantity: number },
  { rejectValue: string }
>("cart/updateCartItem", async ({ itemId, quantity }, { rejectWithValue }) => {
  try {
    const response = await api.put(`cart/items/${itemId}/`, {
      quantity: quantity,
    });
    return response.data;
  } catch (error: any) {
    return rejectWithValue(
      error.response?.data?.detail || "Failed to update cart item"
    );
  }
});

// Remove item from cart
export const removeFromCart = createAsyncThunk<
  number,
  number,
  { rejectValue: string }
>("cart/removeFromCart", async (itemId, { rejectWithValue }) => {
  try {
    await api.delete(`cart/items/${itemId}/`);
    return itemId;
  } catch (error: any) {
    return rejectWithValue(
      error.response?.data?.detail || "Failed to remove item from cart"
    );
  }
});

// Clear entire cart
export const clearCart = createAsyncThunk<void, void, { rejectValue: string }>(
  "cart/clearCart",
  async (_, { rejectWithValue }) => {
    try {
      await api.delete("cart/clear/");
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.detail || "Failed to clear cart"
      );
    }
  }
);

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    // Manual total recalculation if needed
    recalculateTotals: (state) => {
      const { total, itemCount } = calculateCartTotals(state.items);
      state.total = total;
      state.itemCount = itemCount;
    },
  },
  extraReducers: (builder) => {
    builder
      // FETCH CART
      .addCase(fetchCart.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchCart.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.items = action.payload.items;
        state.total = action.payload.total;

        // Calculate item count
        const { itemCount } = calculateCartTotals(action.payload.items);
        state.itemCount = itemCount;

        state.error = null;
      })
      .addCase(fetchCart.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload || "Failed to fetch cart";
      })

      // ADD TO CART
      .addCase(addToCart.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(addToCart.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.items = action.payload.items;
        state.total = action.payload.total;

        // Calculate item count
        const { itemCount } = calculateCartTotals(action.payload.items);
        state.itemCount = itemCount;

        state.error = null;
      })
      .addCase(addToCart.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload || "Failed to add item to cart";
      })

      // UPDATE CART ITEM
      .addCase(updateCartItem.pending, (state) => {
        state.error = null;
      })
      .addCase(updateCartItem.fulfilled, (state, action) => {
        const index = state.items.findIndex(
          (item) => item.id === action.payload.id
        );
        if (index !== -1) {
          state.items[index] = action.payload;

          // Recalculate totals after update
          const { total, itemCount } = calculateCartTotals(state.items);
          state.total = total;
          state.itemCount = itemCount;
        }
        state.error = null;
      })
      .addCase(updateCartItem.rejected, (state, action) => {
        state.error = action.payload || "Failed to update cart item";
      })

      // REMOVE FROM CART
      .addCase(removeFromCart.pending, (state) => {
        state.error = null;
      })
      .addCase(removeFromCart.fulfilled, (state, action) => {
        state.items = state.items.filter((item) => item.id !== action.payload);

        // Recalculate totals after removal
        const { total, itemCount } = calculateCartTotals(state.items);
        state.total = total;
        state.itemCount = itemCount;

        state.error = null;
      })
      .addCase(removeFromCart.rejected, (state, action) => {
        state.error = action.payload || "Failed to remove item from cart";
      })

      // CLEAR CART
      .addCase(clearCart.pending, (state) => {
        state.error = null;
      })
      .addCase(clearCart.fulfilled, (state) => {
        state.items = [];
        state.total = "0.00";
        state.itemCount = 0;
        state.error = null;
      })
      .addCase(clearCart.rejected, (state, action) => {
        state.error = action.payload || "Failed to clear cart";
      });
  },
});

export const { clearError, recalculateTotals } = cartSlice.actions;
export default cartSlice.reducer;

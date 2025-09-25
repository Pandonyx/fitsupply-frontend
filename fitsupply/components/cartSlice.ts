import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { CartItem } from "@/interfaces";

interface CartState {
  items: CartItem[];
}

// Function to load state from localStorage safely
const loadState = (): CartState => {
  try {
    // Ensure this code runs only on the client
    if (typeof window === "undefined") {
      return { items: [] };
    }
    const serializedState = localStorage.getItem("cart");
    if (serializedState === null) {
      return { items: [] };
    }
    return JSON.parse(serializedState);
  } catch (err) {
    return { items: [] };
  }
};

const initialState: CartState = loadState();

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addToCart: (
      state,
      action: PayloadAction<Omit<CartItem, "qty"> & { qty?: number }>
    ) => {
      const newItem = action.payload;
      const existingItem = state.items.find(
        (item) => item.productId === newItem.productId
      );

      if (existingItem) {
        existingItem.qty += newItem.qty || 1;
      } else {
        state.items.push({ ...newItem, qty: newItem.qty || 1 });
      }
      localStorage.setItem("cart", JSON.stringify(state));
    },
    removeFromCart: (state, action: PayloadAction<string>) => {
      state.items = state.items.filter(
        (item) => item.productId !== action.payload
      );
      localStorage.setItem("cart", JSON.stringify(state));
    },
    updateQuantity: (
      state,
      action: PayloadAction<{ productId: string; qty: number }>
    ) => {
      const { productId, qty } = action.payload;
      const itemToUpdate = state.items.find(
        (item) => item.productId === productId
      );
      if (itemToUpdate) {
        if (qty > 0) {
          itemToUpdate.qty = qty;
        } else {
          // Remove item if quantity is 0 or less
          state.items = state.items.filter(
            (item) => item.productId !== productId
          );
        }
      }
      localStorage.setItem("cart", JSON.stringify(state));
    },
    clearCart: (state) => {
      state.items = [];
      localStorage.removeItem("cart");
    },
  },
});

export const { addToCart, removeFromCart, updateQuantity, clearCart } =
  cartSlice.actions;

export default cartSlice.reducer;

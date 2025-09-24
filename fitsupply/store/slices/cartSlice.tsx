import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { CartItem } from "@/types";

type State = { items: CartItem[] };
const initialState: State = { items: [] };

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addToCart: (state, action: PayloadAction<CartItem>) => {
      const found = state.items.find(
        (i) => i.productId === action.payload.productId
      );
      if (found) found.qty += action.payload.qty;
      else state.items.push(action.payload);
    },
    removeFromCart: (state, action: PayloadAction<string>) => {
      state.items = state.items.filter((i) => i.productId !== action.payload);
    },
    updateQty: (state, action: PayloadAction<{ id: string; qty: number }>) => {
      const item = state.items.find((i) => i.productId === action.payload.id);
      if (item) item.qty = action.payload.qty;
    },
    clearCart: (state) => {
      state.items = [];
    },
  },
});

export const { addToCart, removeFromCart, updateQty, clearCart } =
  cartSlice.actions;
export default cartSlice.reducer;

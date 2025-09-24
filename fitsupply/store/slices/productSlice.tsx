import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "@/lib/apiClient";
import { Product } from "@/interfaces";

export const fetchProducts = createAsyncThunk("products/fetch", async () => {
  const { data } = await api.get<Product[]>("/products");
  return data;
});

const productsSlice = createSlice({
  name: "products",
  initialState: { items: [] as Product[], status: "idle" },
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchProducts.pending, (s) => {
      s.status = "loading";
    });
    builder.addCase(fetchProducts.fulfilled, (s, action) => {
      s.items = action.payload;
      s.status = "succeeded";
    });
    builder.addCase(fetchProducts.rejected, (s) => {
      s.status = "failed";
    });
  },
});

export default productsSlice.reducer;

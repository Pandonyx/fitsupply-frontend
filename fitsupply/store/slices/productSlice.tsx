import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import api from "@/lib/apiClient";
import { Product } from "@/interfaces";

export const fetchProducts = createAsyncThunk(
  "products/fetchProducts",
  async (category: string | null = null, { rejectWithValue }) => {
    try {
      // Use api client which already has the correct base URL
      let url = `/products/`;
      if (category) {
        url += `?category=${encodeURIComponent(category)}`;
      }
      const response = await api.get(url);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.detail || error.message);
    }
  }
);

export const fetchProductById = createAsyncThunk(
  "products/fetchProductById",
  async (id: string, { rejectWithValue }) => {
    try {
      // Use api client for consistency
      const response = await api.get(`/products/${id}/`);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.detail || error.message);
    }
  }
);

export const fetchProductBySlug = createAsyncThunk(
  "products/fetchProductBySlug",
  async (slug: string, { rejectWithValue }) => {
    try {
      // Use api client and try multiple approaches
      let response;
      try {
        // First try direct slug lookup
        response = await api.get(`/products/${slug}/`);
        return response.data;
      } catch (firstError) {
        // Fallback to slug filtering
        response = await api.get(`/products/?slug=${slug}`);
        const data: Product[] = response.data;
        if (data && data.length > 0) {
          return data[0];
        }
        throw new Error(`Product with slug "${slug}" not found.`);
      }
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.detail || error.message);
    }
  }
);

const productsSlice = createSlice({
  name: "products",
  initialState: {
    items: [] as Product[],
    selectedItem: null as Product | null,
    status: "idle",
    error: null as string | null,
  },
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProducts.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.items = action.payload;
        state.status = "succeeded";
        state.error = null;
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload as string;
      })
      .addCase(fetchProductById.pending, (state) => {
        state.status = "loading";
        state.selectedItem = null;
        state.error = null;
      })
      .addCase(fetchProductById.fulfilled, (state, action) => {
        state.selectedItem = action.payload;
        state.status = "succeeded";
        state.error = null;
      })
      .addCase(fetchProductById.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload as string;
      })
      .addCase(fetchProductBySlug.pending, (state) => {
        state.status = "loading";
        state.selectedItem = null;
        state.error = null;
      })
      .addCase(fetchProductBySlug.fulfilled, (state, action) => {
        state.selectedItem = action.payload;
        state.status = "succeeded";
        state.error = null;
      })
      .addCase(fetchProductBySlug.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload as string;
      });
  },
});

export const { clearError } = productsSlice.actions;
export default productsSlice.reducer;

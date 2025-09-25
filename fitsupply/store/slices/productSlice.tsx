import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { Product } from "@/interfaces";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

if (!API_BASE_URL) {
  throw new Error(
    "NEXT_PUBLIC_API_URL is not set. Please check your .env.local file."
  );
}

export const fetchProducts = createAsyncThunk(
  "products/fetchProducts",
  async (category: string | null = null, { rejectWithValue }) => {
    try {
      // Correctly construct the URL with the /api/v1/ prefix
      let url = `${API_BASE_URL}api/v1/products/`;
      if (category) {
        url += `?category=${encodeURIComponent(category)}`;
      }
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`Server responded with ${response.status}`);
      }
      const data = await response.json();
      return data;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchProductById = createAsyncThunk(
  "products/fetchProductById",
  async (id: string, { rejectWithValue }) => {
    try {
      // Assumes your API endpoint for a single product is /api/v1/products/{id}/
      const url = `${API_BASE_URL}api/v1/products/${id}/`;
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`Server responded with ${response.status}`);
      }
      const data = await response.json();
      return data;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchProductBySlug = createAsyncThunk(
  "products/fetchProductBySlug",
  async (slug: string, { rejectWithValue }) => {
    try {
      // Fetch a product by its slug. The API returns an array, so we take the first element.
      const url = `${API_BASE_URL}api/v1/products/?slug=${slug}`;
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`Server responded with ${response.status}`);
      }
      const data: Product[] = await response.json();
      if (data && data.length > 0) {
        return data[0];
      }
      throw new Error(`Product with slug "${slug}" not found.`);
    } catch (error: any) {
      return rejectWithValue(error.message);
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
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchProducts.pending, (s) => {
      s.status = "loading";
    });
    builder.addCase(fetchProducts.fulfilled, (s, action) => {
      s.items = action.payload;
      s.status = "succeeded";
    });
    builder.addCase(fetchProducts.rejected, (s, action) => {
      s.status = "failed";
      s.error = action.payload as string;
    });
    builder.addCase(fetchProductById.pending, (s) => {
      s.status = "loading";
      s.selectedItem = null;
    });
    builder.addCase(fetchProductById.fulfilled, (s, action) => {
      s.selectedItem = action.payload;
      s.status = "succeeded";
    });
    builder.addCase(fetchProductById.rejected, (s, action) => {
      s.status = "failed";
      s.error = action.payload as string;
    });
    builder.addCase(fetchProductBySlug.pending, (s) => {
      s.status = "loading";
      s.selectedItem = null;
    });
    builder.addCase(fetchProductBySlug.fulfilled, (s, action) => {
      s.selectedItem = action.payload;
      s.status = "succeeded";
    });
    builder.addCase(fetchProductBySlug.rejected, (s, action) => {
      s.status = "failed";
      s.error = action.payload as string;
    });
  },
});

export default productsSlice.reducer;

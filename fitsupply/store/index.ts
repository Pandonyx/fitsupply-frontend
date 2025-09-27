import { configureStore } from "@reduxjs/toolkit";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";
import { combineReducers } from "@reduxjs/toolkit";

import productsReducer from "./slices/productSlice";
import cartReducer from "./slices/cartSlice";
import authReducer from "./slices/authSlice";
import orderReducer from "./slices/orderSlice";
import dashboardReducer from "./slices/dashboardSlice";

// Cart persistence configuration
const cartPersistConfig = {
  key: "cart",
  storage,
  whitelist: ["items"], // Only persist cart items
};

// Auth persistence configuration
const authPersistConfig = {
  key: "auth",
  storage,
  whitelist: ["token", "user", "isAuthenticated"], // Persist auth state
  blacklist: ["status", "error"], // Don't persist loading states
};

// Create persisted reducers
const persistedCartReducer = persistReducer(cartPersistConfig, cartReducer);
const persistedAuthReducer = persistReducer(authPersistConfig, authReducer);

// Combine all reducers
const rootReducer = combineReducers({
  products: productsReducer,
  cart: persistedCartReducer,
  auth: persistedAuthReducer,
  orders: orderReducer,
  dashboard: dashboardReducer,
});

// Configure store
export const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [
          // Redux persist actions
          "persist/PERSIST",
          "persist/REHYDRATE",
          "persist/PAUSE",
          "persist/PURGE",
          "persist/REGISTER",
          // Auth actions (in case of serialization issues)
          "auth/register/pending",
          "auth/register/fulfilled",
          "auth/register/rejected",
          "auth/login/pending",
          "auth/login/fulfilled",
          "auth/login/rejected",
        ],
        ignoredPaths: ["register", "rehydrate"],
      },
    }),
  devTools: process.env.NODE_ENV !== "production",
});

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

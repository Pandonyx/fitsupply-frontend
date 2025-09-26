import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { store, persistor } from "@/store";
import Layout from "@/components/Layout";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/store";
import { initializeAuth } from "@/store/slices/authSlice";

function AuthInitializer({ children }: { children: React.ReactNode }) {
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    // Initialize auth after store rehydration
    dispatch(initializeAuth());
  }, [dispatch]);

  return <>{children}</>;
}

export default function App({ Component, pageProps }: AppProps) {
  return (
    <Provider store={store}>
      <PersistGate
        loading={
          <div className='flex justify-center items-center min-h-screen'>
            Loading...
          </div>
        }
        persistor={persistor}>
        <AuthInitializer>
          <Layout>
            <Component {...pageProps} />
          </Layout>
        </AuthInitializer>
      </PersistGate>
    </Provider>
  );
}

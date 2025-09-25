import { useEffect } from "react";
import { useSelector } from "react-redux";
import { useRouter } from "next/router";
import { RootState } from "@/store";

const AdminRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated, user, status } = useSelector(
    (state: RootState) => state.auth
  );
  const router = useRouter();

  useEffect(() => {
    // If auth state is still loading, do nothing yet.
    if (status === "loading") {
      return;
    }

    // If not authenticated or the user is not staff, redirect to login.
    if (!isAuthenticated || (user && !user.is_staff)) {
      router.push("/login");
    }
  }, [isAuthenticated, user, status, router]);

  // While loading or if user is not yet confirmed as staff, show a loading indicator.
  if (status === "loading" || !user || !user.is_staff) {
    return <div>Loading Admin Access...</div>;
  }

  return <>{children}</>;
};

export default AdminRoute;

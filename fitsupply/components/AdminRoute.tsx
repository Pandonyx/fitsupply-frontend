import { useSelector } from "react-redux";
import { RootState } from "@/store";
import { useRouter } from "next/router";
import { useEffect } from "react";

export default function AdminRoute({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, isAuthenticated } = useSelector(
    (state: RootState) => state.auth
  );
  const router = useRouter();

  // Add debugging
  console.log("AdminRoute - Auth state:", {
    isAuthenticated,
    user: user ? { username: user.username, is_staff: user.is_staff } : null,
  });

  useEffect(() => {
    console.log("AdminRoute useEffect triggered");

    if (!isAuthenticated) {
      console.log("Not authenticated, redirecting to login");
      router.push("/login");
    } else if (user && !user.is_staff) {
      console.log("User is not staff, redirecting home");
      router.push("/");
    } else if (user && user.is_staff) {
      console.log("User is admin, allowing access");
    }
  }, [user, isAuthenticated, router]);

  if (!user) {
    console.log("No user, returning null");
    return null;
  }

  if (!user.is_staff) {
    console.log("User not staff, returning null");
    return null;
  }

  console.log("Rendering admin content");
  return <>{children}</>;
}

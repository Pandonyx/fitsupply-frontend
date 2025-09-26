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

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/login");
    } else if (user && !user.is_staff) {
      router.push("/"); // send non-admins home
    }
  }, [user, isAuthenticated, router]);

  if (!user) return null;

  return <>{children}</>;
}

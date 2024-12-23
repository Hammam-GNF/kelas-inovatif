import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export function useAuth(requireAuth = true) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const isLoading = status === "loading";
  const isAuthenticated = !!session?.user;

  useEffect(() => {
    if (!isLoading) {
      if (requireAuth && !isAuthenticated) {
        router.push("/auth/signin");
      }
    }
  }, [isLoading, requireAuth, isAuthenticated, router]);

  return {
    session,
    isLoading,
    isAuthenticated,
    user: session?.user,
  };
}

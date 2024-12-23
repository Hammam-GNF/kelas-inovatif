import { useSession } from "next-auth/react";
import { UserRole } from "@/types/auth";

interface RoleGateProps {
  children: React.ReactNode;
  allowedRoles: UserRole[];
  fallback?: React.ReactNode;
}

export default function RoleGate({
  children,
  allowedRoles,
  fallback,
}: RoleGateProps) {
  const { data: session } = useSession();
  const userRole = session?.user?.role as UserRole;

  if (!session || !allowedRoles.includes(userRole)) {
    return fallback || null;
  }

  return <>{children}</>;
}

import { ReactNode } from "react";
import { useNavigate } from "@tanstack/react-router";
import { useAuth } from "@/lib/auth";

interface ProtectedRouteProps {
  children: ReactNode;
  allowedRoles: ("student" | "university" | "admin")[];
  fallbackTo?: string;
}

export function ProtectedRoute({ children, allowedRoles, fallbackTo = "/login" }: ProtectedRouteProps) {
  const navigate = useNavigate();
  const { role, loading, isAuthenticated } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="inline-block animate-spin rounded-full size-8 border-2 border-border border-t-academic" />
      </div>
    );
  }

  if (!isAuthenticated() || !role || !allowedRoles.includes(role)) {
    navigate({ to: fallbackTo });
    return null;
  }

  return <>{children}</>;
}

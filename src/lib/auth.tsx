import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import type { Session, User } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";

export type AccountType = "student" | "university" | "admin";
export type AppRole = "student" | "university" | "admin";

export interface Profile {
  id: string;
  full_name: string | null;
  email: string | null;
  username: string | null;
  account_type: string;
}

interface AuthContextValue {
  session: Session | null;
  user: User | null;
  profile: Profile | null;
  role: AppRole | null;
  loading: boolean;
  isStudent: () => boolean;
  isUniversity: () => boolean;
  isAdmin: () => boolean;
  isAuthenticated: () => boolean;
  signOut: () => Promise<void>;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [role, setRole] = useState<AppRole | null>(null);
  const [loading, setLoading] = useState(true);

  const loadProfile = async (uid: string, email?: string) => {
    const { data: profileData } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", uid)
      .maybeSingle();
    
    const profile = (profileData as Profile) ?? null;
    setProfile(profile);

    // Load user role from user_roles table
    const { data: roleData } = await supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", uid)
      .maybeSingle();
    
    let userRole = (roleData?.role as AppRole) ?? null;
    
    // If no role found, check if they're an admin by email
    if (!userRole && email) {
      const { data: adminData } = await supabase
        .from("admin_emails")
        .select("email")
        .eq("email", email)
        .maybeSingle();
      
      if (adminData) {
        userRole = "admin";
      }
    }
    
    setRole(userRole);
  };

  useEffect(() => {
    const { data: sub } = supabase.auth.onAuthStateChange((_event, newSession) => {
      setSession(newSession);
      setUser(newSession?.user ?? null);
      if (newSession?.user) {
        setTimeout(() => loadProfile(newSession.user.id, newSession.user.email), 0);
      } else {
        setProfile(null);
        setRole(null);
      }
    });

    supabase.auth.getSession().then(({ data: { session: s } }) => {
      setSession(s);
      setUser(s?.user ?? null);
      if (s?.user) loadProfile(s.user.id, s.user.email);
      setLoading(false);
    });

    return () => sub.subscription.unsubscribe();
  }, []);

  const signOut = async () => {
    await supabase.auth.signOut();
    setProfile(null);
    setRole(null);
  };

  const refreshProfile = async () => {
    if (user) await loadProfile(user.id, user.email);
  };

  const isStudent = () => role === "student";
  const isUniversity = () => role === "university";
  const isAdmin = () => role === "admin";
  const isAuthenticated = () => !!session && !!user;

  return (
    <AuthContext.Provider
      value={{
        session,
        user,
        profile,
        role,
        loading,
        isStudent,
        isUniversity,
        isAdmin,
        isAuthenticated,
        signOut,
        refreshProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
}
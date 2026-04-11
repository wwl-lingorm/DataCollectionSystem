import { createContext, ReactNode, useContext, useEffect, useMemo, useState } from "react";
import { loginRequest } from "../lib/api";
import { roleMeta, type UserRole } from "../lib/workspace";

export interface AuthUser {
  id: string;
  username: string;
  role: UserRole;
}

interface AuthContextValue {
  user: AuthUser | null;
  token: string | null;
  viewRole: UserRole;
  login: (username: string, password: string) => Promise<AuthUser>;
  logout: () => void;
  switchViewRole: (role: UserRole) => void;
}

const storageKey = "dcs-auth-state";
const viewKey = "dcs-view-role";

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

function readStoredAuth() {
  const raw = localStorage.getItem(storageKey);

  if (!raw) {
    return { user: null as AuthUser | null, token: null as string | null };
  }

  try {
    return JSON.parse(raw) as { user: AuthUser | null; token: string | null };
  } catch {
    return { user: null, token: null };
  }
}

function readStoredViewRole(defaultRole: UserRole) {
  const raw = localStorage.getItem(viewKey);
  if (raw === "enterprise" || raw === "city" || raw === "province") {
    return raw;
  }
  return defaultRole;
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const stored = readStoredAuth();
  const [user, setUser] = useState<AuthUser | null>(stored.user);
  const [token, setToken] = useState<string | null>(stored.token);
  const [viewRole, setViewRole] = useState<UserRole>(() => readStoredViewRole(stored.user?.role ?? "enterprise"));

  useEffect(() => {
    localStorage.setItem(storageKey, JSON.stringify({ user, token }));
  }, [user, token]);

  useEffect(() => {
    localStorage.setItem(viewKey, viewRole);
  }, [viewRole]);

  const value = useMemo<AuthContextValue>(() => {
    return {
      user,
      token,
      viewRole,
      login: async (username: string, password: string) => {
        const response = await loginRequest(username, password);
        const nextUser: AuthUser = response.user;
        setUser(nextUser);
        setToken(response.token);
        setViewRole(nextUser.role);
        return nextUser;
      },
      logout: () => {
        setUser(null);
        setToken(null);
        setViewRole("enterprise");
      },
      switchViewRole: (role: UserRole) => {
        setViewRole(role);
      }
    };
  }, [token, user, viewRole]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }

  return context;
}

export function getHomePath(role: UserRole) {
  return roleMeta[role].home;
}

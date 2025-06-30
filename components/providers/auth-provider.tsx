"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import Cookies from "js-cookie";
import { api } from "@/lib/api";

interface User {
  id: string;
  email: string;
  name: string;
  orgId: string;
  role: string;
  createdAt: string;
  organization: {
    id: string;
    name: string;
  };
}

interface AuthContextType {
  user: User | null;
  setUser: (user: User | null) => void;
  loading: boolean;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  setUser: () => {},
  loading: true,
  refreshUser: async () => {},
});

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const refreshUser = async () => {
    // Check if auth token cookie exists before making API call
    const authToken = Cookies.get('auth-token');
    if (!authToken) {
      setUser(null);
      setLoading(false);
      return;
    }

    try {
      const response = await api.auth.getUser();
      setUser(response.user);
    } catch (error) {
      console.error("Failed to fetch user:", error);
      // Clear the auth token cookie if the session is invalid
      Cookies.remove('auth-token');
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refreshUser();
  }, []);

  return (
    <AuthContext.Provider value={{ user, setUser, loading, refreshUser }}>
      {children}
    </AuthContext.Provider>
  );
}
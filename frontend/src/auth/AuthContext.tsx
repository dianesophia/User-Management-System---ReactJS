import { createContext, useContext, useState, useEffect } from "react";
import type { ReactNode } from "react";
import { AuthService } from "../services/auth.service";
import { authStore } from "./auth.store";

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: "admin" | "user";
  gender: "male" | "female" | "other";
  phoneNumber?: string;
  address? : string;
  createdAt: string;
  updatedAt: string;
}

export interface AuthContextType {
  user: User | null;
  login: (data: { email: string; password: string }) => Promise<void>;
  register: (data: any) => Promise<void>;
  logout: () => void;
  loading: boolean;
  error: string | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  
  useEffect(() => {
    const fetchProfile = async () => {
      const token = localStorage.getItem("accessToken");
      if (token) {
        try {
          const profile = await AuthService.profile();
          setUser(profile);
        } catch (err: any) {
          console.error("Profile fetch failed:", err);
          localStorage.removeItem("accessToken");
          localStorage.removeItem("refreshToken");
          localStorage.removeItem("role");
          localStorage.removeItem("userId");
        }
      }
      setLoading(false);
    };
    fetchProfile();
  }, []);

  const login = async (data: { email: string; password: string }) => {
    try {
      setError(null);
      const res = await AuthService.login(data);
      authStore.setSession(res);
      setUser(res.user);
    } catch (err: any) {
      const message = err.response?.data?.message || "Login failed";
      setError(message);
      throw err;
    }
  };

  const register = async (data: any) => {
    try {
      setError(null);
      const res = await AuthService.register(data);
      authStore.setSession(res);
      setUser(res.user);
    } catch (err: any) {
      const message = err.response?.data?.message || "Registration failed";
      setError(message);
      throw err;
    }
  };

  const logout = () => {
    AuthService.logout();
    authStore.clear();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, loading, error }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
};

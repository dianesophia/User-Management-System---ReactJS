import { api } from "../api/axios";
import type { User } from "../auth/AuthContext";

export interface LoginDto {
  email: string;
  password: string;
}

export interface RegisterDto {
  email: string;
  firstName: string;
  lastName: string;
  gender: "male" | "female" | "other";
  phoneNumber: string;
  address: string;
  password: string;
}

export interface AuthResponse {
  user: User;
  token: {
    accessToken: string;
    refreshToken: string;
  };
}

export const AuthService = {
  login: async (data: LoginDto): Promise<AuthResponse> => {
    const res = await api.post("/auth/login", data);
    return res.data;
  },

  register: async (data: RegisterDto): Promise<AuthResponse> => {
    const res = await api.post("/auth/register", data);
    return res.data;
  },

  profile: async (): Promise<User> => {
    const res = await api.get("/auth/user");
    return res.data.user;
  },

  logout: async (): Promise<void> => {
    const refreshToken = localStorage.getItem("refreshToken");
    if (refreshToken) {
      try {
        await api.post("/auth/logout", { refreshToken });
      } catch (err) {
        console.error("Logout request failed:", err);
      }
    }
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("role");
    localStorage.removeItem("userId");
  },

  refresh: async (refreshToken: string): Promise<AuthResponse> => {
    const res = await api.post("/auth/refresh", { refreshToken });
    return res.data;
  },
};

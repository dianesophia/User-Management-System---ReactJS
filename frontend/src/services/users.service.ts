import { api } from "../api/axios";
import type { User } from "../auth/AuthContext";

export interface CreateUserDto {
  email: string;
  firstName: string;
  lastName: string;
  gender: "male" | "female" | "other";
  phoneNumber: string;
  address: string;
  role: "admin" | "user";
  password: string;
}

export interface UpdateUserDto {
  email?: string;
  firstName?: string;
  lastName?: string;
  gender?: "male" | "female" | "other";
  phoneNumber?: string;
  address?: string;
  password?: string;
  // Admin can update role when editing other users
  role?: "admin" | "user";
}

export const UsersService = {
  /**
   * Get all users (Admin only)
   * Returns array of all users
   */
  getAll: async (): Promise<User[]> => {
    const res = await api.get("/users");
    return res.data;
  },

  /**
   * Get a single user by ID (Admin only)
   * @param id - User ID to retrieve
   */
  getOne: async (id: string): Promise<User> => {
    const res = await api.get(`/users/${id}`);
    return res.data;
  },

  /**
   * Create a new user (Admin only)
   * @param data - New user data
   */
  create: async (data: CreateUserDto): Promise<User> => {
    const res = await api.post("/users", data);
    return res.data;
  },

  /**
   * Update any user (Admin only)
   * Admin can update any user's profile including role
   * @param id - User ID to update
   * @param data - Fields to update
   */
  update: async (id: string, data: UpdateUserDto): Promise<User> => {
    const res = await api.put(`/users/${id}`, data);
    return res.data;
  },

  /**
   * Update current user's own profile
   * User can only update their own profile (not role)
   * @param data - Fields to update
   */
  updateSelf: async (data: UpdateUserDto): Promise<User> => {
    const res = await api.put("/users/me", data);
    return res.data;
  },

  /**
   * Delete a user (Admin only)
   * @param id - User ID to delete
   */
  remove: async (id: string): Promise<User> => {
    const res = await api.delete(`/users/${id}`);
    return res.data;
  },
};

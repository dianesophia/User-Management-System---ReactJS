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
  role?: "admin" | "user";
}

export const UsersService = {
 
  getAll: async (): Promise<User[]> => {
    const res = await api.get("/users");
    return res.data;
  },

  
  getOne: async (id: string): Promise<User> => {
    const res = await api.get(`/users/${id}`);
    return res.data;
  },


  create: async (data: CreateUserDto): Promise<User> => {
    const res = await api.post("/users", data);
    return res.data;
  },

  
  update: async (id: string, data: UpdateUserDto): Promise<User> => {
    const res = await api.put(`/users/${id}`, data);
    return res.data;
  },

 
  updateSelf: async (data: UpdateUserDto): Promise<User> => {
    const res = await api.put("/users/me", data);
    return res.data;
  },


  remove: async (id: string): Promise<User> => {
    const res = await api.delete(`/users/${id}`);
    return res.data;
  },
};

import { api } from "./axios";

export interface LoginPayload {
  email: string;
  password: string;
}

export interface RegisterPayload {
  firstName: string;
  lastName: string;
  phoneNumber: string;
  gender: "male" | "female";
  email: string;
  password: string;
}

export const loginApi = async (payload: LoginPayload) => {
  const { data } = await api.post("/auth/login", payload);
  return data;
};

export const registerApi = async (payload: RegisterPayload) => {
  const { data } = await api.post("/auth/register", payload);
  return data;
};

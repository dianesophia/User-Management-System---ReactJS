import { api } from "./axios";

export const getUsersApi = async () => {
  const { data } = await api.get("/users");
  return data;
};

export const createUserApi = async (payload: any) => {
  const { data } = await api.post("/users", payload);
  return data;
};

export const updateUserApi = async (id: string, payload: any) => {
  const { data } = await api.patch(`/users/${id}`, payload);
  return data;
};

export const deleteUserApi = async (id: string) => {
  const { data } = await api.delete(`/users/${id}`);
  return data;
};

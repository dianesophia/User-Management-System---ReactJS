import { axios } from "@/lib/axios";
import type { RegisterCredentialsDTO } from "../../types";
import { authUrl } from "../authApi";
import type { AxiosError } from "axios";
import { useMutation, type MutationConfig } from "@/lib/react-query";
import { useNotification } from "@/hooks";

export const registerWithEmailAndPassword = async (data: RegisterCredentialsDTO) => {
  try {
    const response = await axios.post(authUrl.register, data);
    return response.data;
  } catch (err) {
    console.log(err)
    const error = err as AxiosError<{ message: string, statusCode: string, error: string }>;
    throw new Error(error.response?.data?.message || 'Registration failed');
  }
};

type UseRegisterOption = {
  config?: MutationConfig<typeof registerWithEmailAndPassword>;
};

export const useRegisterWithEmailAndPassword = ({ config }: UseRegisterOption = {}) => {
  const notification = useNotification();
  return useMutation({
    onError: (err) => {
      notification.show({
        type: 'error',
        message: err.message,
        title: 'Registration Failed',
      });
    },

    onSuccess: (res: any) => {
      notification.show({
        type: 'success',
        message: res.message || 'Create account is successful',
        title: 'Account created',
      });
    },

    mutationFn: registerWithEmailAndPassword,
    ...config,
  });
}
import { axios } from "@/lib/axios";
import type { LoginCredentialsDTO } from "../../types";
import { authUrl } from "../authApi";
import type { AxiosError } from "axios";
import { useMutation, type MutationConfig } from "@/lib/react-query";
import { useNotification } from "@/hooks";
import { persistToken } from "@/utils/persistToken";

export const loginWithEmailAndPassword = async (data: LoginCredentialsDTO) => {
  try {
    const response = await axios.post(authUrl.login, data);
    return response.data;
  } catch (err) {
    const error = err as AxiosError<{ message: string, statusCode: string, error: string }>;
    throw new Error(error.response?.data?.message || 'Login failed');
  }
};

type UseLoginOptions = {
  config?: MutationConfig<typeof loginWithEmailAndPassword>;
};

export const useLoginWithEmailAndPassword = ({ config }: UseLoginOptions = {}) => {
  const notification = useNotification();
  return useMutation({
    onError: (err) => {
      notification.show({
        type: 'error',
        message: err.message,
        title: 'Login Failed',
      });
    },

    onSuccess: (res: any) => {
      persistToken(
        {
          accessToken: res.data.token.accessToken,
          refreshToken: res.data.token.refreshToken,
        },
        true,
      );
      
      notification.show({
        type: 'success',
        message: res.message || 'Logged is successful',
        title: 'Logged in',
      });
    },

    mutationFn: loginWithEmailAndPassword,
    ...config,
  });
}
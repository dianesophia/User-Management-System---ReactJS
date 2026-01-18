import { QueryCache, QueryClient, type DefaultOptions, type UseInfiniteQueryOptions, type UseMutationOptions, type UseQueryOptions } from "@tanstack/react-query";
import type { AxiosError } from "axios";

const queryConfig: DefaultOptions = {
  queries: {
    throwOnError: false,
    refetchOnWindowFocus: false,
    retry(failureCount, error: any){
      if(error.status === 404 || error.status === 401) return false;
      else if (failureCount < 1) return true;
      else return true; 
    }
  },
  mutations: {
    networkMode: 'always'
  }
};

export const queryClient = new QueryClient({
  defaultOptions: queryConfig,
});

export const queryCache = new QueryCache();

export type ExtractFnReturnType<FnType extends (...args: any) => any> = Awaited<ReturnType<FnType>>;

export type QueryConfig<QueryFnType extends (...args: any) => any> = Omit<
  UseQueryOptions<ExtractFnReturnType<QueryFnType>>,
  'queryKey' | 'queryFn'
>;

export type InfiniteQueryConfig<QueryFnType extends (...args: any) => any> = UseInfiniteQueryOptions<
  ExtractFnReturnType<QueryFnType>
>;

export type MutationConfig<MutationFnType extends (...args: any) => any> = UseMutationOptions<
  ExtractFnReturnType<MutationFnType>,
  AxiosError,
  Parameters<MutationFnType>[0]
>;

export { useQuery, useMutation, useQueryClient, useInfiniteQuery, type InfiniteData } from '@tanstack/react-query';
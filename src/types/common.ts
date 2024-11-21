import { UseQueryOptions, QueryKey } from '@tanstack/react-query'
import { AxiosError } from 'axios'

export type UseQueryCustomOptions<TData = unknown, TError = AxiosError, TQueryKey extends QueryKey = QueryKey> = Omit<
  UseQueryOptions<TData, TError, TData, TQueryKey>,
  'queryKey' | 'queryFn'
>

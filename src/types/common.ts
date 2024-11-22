import { UseQueryOptions, QueryKey, UseInfiniteQueryOptions, InfiniteData } from '@tanstack/react-query'
import { AxiosError } from 'axios'

export type UseQueryCustomOptions<TData = unknown, TError = AxiosError, TQueryKey extends QueryKey = QueryKey> = Omit<
  UseQueryOptions<TData, TError, TData, TQueryKey>,
  'queryKey' | 'queryFn'
>

// 무한 스크롤 쿼리용 새로운 타입
export type UseInfiniteQueryCustomOptions<TData> = Omit<
  UseInfiniteQueryOptions<TData, AxiosError, InfiniteData<TData, number>, TData, string[], number>,
  'queryKey' | 'queryFn'
>

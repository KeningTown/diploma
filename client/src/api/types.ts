import { AxiosResponse, AxiosError } from 'axios'

export type RequestArgs = unknown[]

export type RequestFunction<
  D = unknown,
  A extends RequestArgs = RequestArgs
> = (...args: A) => Promise<AxiosResponse<D>>

export type DefaultError = {
  message: string
}

export type RequestState<E = DefaultError> = {
  isLoading: boolean
  isSuccess?: boolean
  error?: AxiosError<E>
}

export type Pagination = Partial<{
  limit: number
  offset: number
}>

export type ResponseList<T = unknown> = {
  data: T[]
  nav: Pagination & {
    count: number
  }
}

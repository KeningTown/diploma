import { useState, useCallback, useMemo, useEffect } from 'react'
import { AxiosError } from 'axios'

import { RequestFunction, RequestArgs, RequestState, DefaultError } from '@/api'

export const useRequest = <D, A extends RequestArgs>(
  req: RequestFunction<D, A>,
  args?: A
) => {
  const [data, setData] = useState<Awaited<ReturnType<typeof req>>['data']>()
  const [error, setError] = useState<AxiosError>()
  const [isLoading, setIsLoading] = useState(false)
  const [isSuccess, setIsSuccess] = useState<boolean>()

  const request = useCallback(
    async <E = DefaultError>(...args: Parameters<typeof req>) => {
      setIsLoading(true)
      setIsSuccess(undefined)

      let data: D | undefined
      let error: AxiosError<E> | undefined

      try {
        data = (await req(...args)).data

        setIsSuccess(true)
      } catch (e) {
        error = e as AxiosError<E>

        setIsSuccess(false)
      }

      setData(data)
      setError(error)
      setIsLoading(false)

      if (!error) {
        return { data: data as D, error }
      }

      return { data, error }
    },
    [req]
  )

  const reload = useCallback(() => args && request(...args), [args, request])

  useEffect(() => {
    reload()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const state: RequestState = useMemo(
    () => ({
      error: error as AxiosError<DefaultError>,
      isLoading,
      isSuccess
    }),
    [error, isLoading, isSuccess]
  )

  return useMemo(
    () => ({ ...state, request, reload, data }),
    [data, reload, request, state]
  )
}

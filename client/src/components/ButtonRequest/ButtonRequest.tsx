import React, { useCallback } from 'react'
import { saveAs } from 'file-saver'

import { RequestArgs, RequestFunction } from '@/api'

import { useRequest, useNotification } from '@/hooks'

import { ButtonProps, Button } from '@/ui'

const defaultArgs: RequestArgs = []

type Props<D, A extends RequestArgs> = Omit<
  ButtonProps,
  'loading' | 'onClick'
> & {
  download?: boolean | string
  request: RequestFunction<D, A>
  args?: A
  successMessage?: React.ReactNode
  errorMessage?: React.ReactNode
  onSuccess?: (data: D) => void
}

function ButtonRequest<D, A extends RequestArgs>({
  download,
  request: req,
  args = defaultArgs as A,
  successMessage,
  errorMessage,
  onSuccess,
  ...props
}: Props<D, A>) {
  const notify = useNotification()

  const { request, isLoading } = useRequest(req)

  const handleClick = useCallback(() => {
    request(...(args as A)).then(({ data, error }) => {
      if (error) {
        if (errorMessage) {
          return notify('error', errorMessage)
        }

        return
      }

      download &&
        saveAs(
          data as Blob,
          typeof download === 'string' ? download : undefined
        )
      successMessage && notify('success', successMessage)
      onSuccess && onSuccess(data)
    })
  }, [args, download, errorMessage, notify, onSuccess, request, successMessage])

  return <Button {...props} loading={isLoading} onClick={handleClick} />
}

export default ButtonRequest

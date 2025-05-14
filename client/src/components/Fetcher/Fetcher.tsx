import React, { useMemo, useEffect, useCallback } from 'react'
import { useParams } from 'react-router-dom'
import { Spin, Alert, Button, Pagination } from 'antd'

import { RequestFunction, RequestArgs, ResponseList } from '@/api'

import { useRequest, usePagination } from '@/hooks'

import * as Styled from './Fetcher.styled'

type CommonProps<D, A extends RequestArgs> = {
  fromPath?: boolean
  paginate?: boolean
  isReloaded?: boolean
  filter?: Record<string, unknown>
  request: RequestFunction<D, A>
  args?: A
}

type ChildrenProps<D> = {
  data: D
  isLoading: boolean
  reload: () => void
}

type Props<D, A extends RequestArgs> = CommonProps<D, A> &
  (
    | {
        loader: true
        children: (props: ChildrenProps<D>) => React.ReactNode
      }
    | {
        loader?: false
        children: (props: ChildrenProps<D | undefined>) => React.ReactNode
      }
  )

// TODO: fix clear pagination

function Fetcher<D, A extends RequestArgs>({
  fromPath,
  loader,
  paginate,
  isReloaded,
  filter,
  request: req,
  args,
  children
}: Props<D, A>) {
  const { id } = useParams<{ id: string }>()

  const { request, data, error, isLoading } = useRequest(req)

  const { pagination, paginationProps, clearPagination } = usePagination({
    data: data as ResponseList
  })

  const requestArgs = useMemo(() => {
    if (fromPath && id) {
      return [id]
    }

    if (paginate || filter) {
      return [{ ...(pagination || {}), ...(filter || {}) }]
    }

    return args || []
  }, [args, filter, fromPath, id, paginate, pagination])

  useEffect(() => {
    pagination.offset && clearPagination()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [clearPagination, filter])

  const handleRequest = useCallback(
    () => request(...(requestArgs as A)),
    [request, requestArgs]
  )

  useEffect(() => {
    handleRequest()
  }, [handleRequest, isReloaded])

  const child =
    loader && !data
      ? null
      : children({
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore
          data,
          isLoading,
          reload: handleRequest
        })

  if (error) {
    return (
      <Styled.Container
        as={Alert}
        showIcon
        type="error"
        message="Не удалось загрузить данные"
        description={error.response?.data?.message || error.message}
        action={
          <Button
            type="default"
            size="small"
            loading={isLoading}
            onClick={handleRequest}
          >
            Обновить
          </Button>
        }
      />
    )
  }

  return (
    <>
      {loader && (isLoading || data === undefined) ? <Spin /> : child}
      {paginate && (
        <Styled.Pagination
          as={Pagination}
          {...paginationProps}
          hideOnSinglePage
          size="small"
        />
      )}
    </>
  )
}

export default Fetcher

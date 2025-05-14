import { useState, useMemo, useCallback } from 'react'
import { TablePaginationConfig } from 'antd'

import { ResponseList, Pagination } from '@/api'

export type PaginationProps = TablePaginationConfig

type UsePaginationProps = {
  limit?: number
  data?: ResponseList
}

export const usePagination = ({
  limit = 10,
  data
}: UsePaginationProps = {}) => {
  const initial = useMemo<Pagination>(() => ({ limit }), [limit])

  const [pagination, setPagination] = useState(initial)

  const handleChange = useCallback((page: number, limit: number) => {
    const offset = (page - 1) * limit

    setPagination({ offset, limit })
  }, [])

  const paginationProps = useMemo<PaginationProps>(() => {
    const offset = data?.nav?.offset || 0
    const pageSize = data?.nav?.limit
    const current = pageSize ? offset / pageSize + 1 : 1

    return {
      showSizeChanger: false,
      position: ['bottomLeft'],
      current,
      pageSize,
      total: data?.nav?.count,
      onChange: handleChange
    }
  }, [handleChange, data?.nav])

  const clearPagination = useCallback(() => {
    setPagination(initial)
  }, [initial])

  return useMemo(
    () => ({
      pagination,
      paginationProps,
      clearPagination
    }),
    [clearPagination, pagination, paginationProps]
  )
}

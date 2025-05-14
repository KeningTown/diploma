import React from 'react'
import { TableColumnType } from 'antd'

type TableColumn<D extends object, K extends keyof D> = Omit<
  TableColumnType<D>,
  'dataIndex' | 'render'
> & {
  dataIndex: K
  render?: (value: D[K], record: D, index: number) => React.ReactNode
}

type TableColumnIndexed<
  D extends object,
  T = TableColumn<D, keyof D>
> = T extends { dataIndex: infer P }
  ? P extends keyof D
    ? TableColumn<D, P>
    : T
  : T

export type TableColumns<D extends object> = TableColumnIndexed<D>[]

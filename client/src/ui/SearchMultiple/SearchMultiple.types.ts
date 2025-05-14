import React from 'react'
import { SelectProps, RefSelectProps } from 'antd'

import { Option, Options } from '../SelectMultiple/SelectMultiple.types'

import { RequestFunction } from '@/api'

export type DataToOptions<T> = (data: T, searchValue: string) => Options

export type SearchMultipleProps<T> = Pick<SelectProps, 'onChange'> & {
  ref?: React.Ref<RefSelectProps>
  isLoading?: boolean
  value?: Options
  excluded?: number[]
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  api: RequestFunction<T, any[]>
  getApiArgs: (value: string) => Array<unknown>
  dataToOptions: DataToOptions<T>
  optionRender?: (option: Option & { data: Option }) => React.ReactNode
}

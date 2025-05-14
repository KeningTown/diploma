import React from 'react'
import { SelectProps, RefSelectProps } from 'antd'

import { RequestFunction } from '@/api'

export type Option = {
  value: number
  label: string | React.ReactNode
} & Partial<{
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any
}>

export type Options = Option[]

export type OptionsMapper<T> = (item: T) => Option

export type SelectMultipleProps<T> = Pick<SelectProps, 'onChange'> & {
  ref?: React.Ref<RefSelectProps>
  value?: number[]
  excluded?: number[]
  request: RequestFunction<unknown, unknown[]>
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  dataDecorator?: (data: any) => T[]
  optionsMapper: OptionsMapper<T>
}

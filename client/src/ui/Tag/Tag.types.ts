import React from 'react'
import { TagProps as AntTagProps } from 'antd'

export type TagProps = Omit<AntTagProps, 'closable' | 'closeIcon'> & {
  isClosing?: boolean
  to?: false | string
  extra?: false | React.ReactNode
}

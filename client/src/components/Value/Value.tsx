import React, { useMemo } from 'react'
import { Link } from 'react-router-dom'
import { Typography } from 'antd'
import { format } from 'date-fns'

import { ValueType } from './Value.constants'

import { router } from '@/services'

import * as Styled from './Value.styled'

type Props = React.PropsWithChildren<{
  copy?: boolean
  bold?: boolean
  inline?: boolean
  ellipsis?: boolean
  type?: ValueType
  to?: string
  params?: Record<string, unknown>
}>

const Value: React.FC<Props> = ({
  copy,
  bold,
  inline = false,
  ellipsis,
  type,
  to,
  params,
  children
}) => {
  const value = useMemo(() => {
    if (type === ValueType.DATE) {
      return format(new Date(children as string), 'dd.MM.yyyy HH:mm')
    }

    if (Array.isArray(children)) {
      return children.map((item, i) => (
        <React.Fragment key={i}>
          {i > 0 && ', '}
          {item}
        </React.Fragment>
      ))
    }

    return children
  }, [children, type])

  if (type === ValueType.LINK && to) {
    return (
      <Styled.Link as={Link} to={router.buildPath(to, params)}>
        {value}
      </Styled.Link>
    )
  }

  return (
    <Styled.Container
      as={Typography.Text}
      copyable={copy}
      strong={bold}
      ellipsis={ellipsis}
      $inline={inline}
    >
      {value}
    </Styled.Container>
  )
}

export default Value

import React from 'react'
import { Card as AntdCard, CardProps as AntdCardProps } from 'antd'

import * as Styled from './Card.styled'

type Props = AntdCardProps

const Card: React.FC<Props> = ({ children, ...props }) => {
  return (
    <Styled.Container as={AntdCard} {...props}>
      {children}
    </Styled.Container>
  )
}

export default Card

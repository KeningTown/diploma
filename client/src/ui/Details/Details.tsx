import React from 'react'
import { Descriptions, DescriptionsProps } from 'antd'

import * as Styled from './Details.styled'

type Props = Omit<DescriptionsProps, 'bordered' | 'size' | 'column'>

const Details: React.FC<Props> = ({ title, ...props }) => {
  return (
    <Styled.Container
      as={Descriptions}
      {...props}
      title={title && <Styled.Title>{title}</Styled.Title>}
      bordered
      size="small"
      column={1}
    />
  )
}

export default Details

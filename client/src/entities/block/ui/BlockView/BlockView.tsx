import React from 'react'
import { Col, Space } from 'antd'

import { BlockProps } from '../../model'

import { SIZE } from '@/ui/theme'
import { Card } from '@/ui'

import * as Styled from './BlockView.styled'

type Props = React.PropsWithChildren<{
  isSelected?: boolean
  item: BlockProps.Item | BlockProps.ItemAvailable
  extra?: React.ReactNode
}>

const BlockView: React.FC<Props> = ({
  isSelected = false,
  item,
  extra,
  children
}) => {
  return (
    <Col lg={SIZE[item.width]} md={24}>
      <Styled.Container
        as={Card}
        $isSelected={isSelected}
        title={item.title}
        extra={extra}
      >
        <Styled.Space as={Space} direction="vertical" size="middle">
          {children}
        </Styled.Space>
      </Styled.Container>
    </Col>
  )
}

export default BlockView

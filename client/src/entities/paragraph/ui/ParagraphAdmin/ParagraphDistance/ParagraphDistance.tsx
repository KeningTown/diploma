import React, { useMemo } from 'react'
import { Popover, Tag } from 'antd'

import { getInfo } from './ParagraphDistance.constants'

import * as Styled from './ParagraphDistance.styled'

type Props = {
  value: number
}

const ParagraphDistance: React.FC<Props> = ({ value }) => {
  const { color, correlation } = useMemo(() => getInfo(value), [value])

  return (
    <Popover
      placement="bottom"
      trigger="click"
      content={<>{correlation}</>}
      overlayStyle={{ maxWidth: 300 }}
    >
      <Styled.Tag as={Tag} bordered={false} color={color}>
        {value}
      </Styled.Tag>
    </Popover>
  )
}

export default ParagraphDistance

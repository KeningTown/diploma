import React from 'react'
import { Row } from 'antd'

import { getGutter } from '@/ui/theme'

import * as Styled from './BlockGridView.styled'

const GUTTER = getGutter(2)

type Props = React.PropsWithChildren<{
  width?: number
}>

const BlockGridView = React.forwardRef<HTMLDivElement, Props>(
  ({ width, children }, ref) => {
    return (
      <Styled.Container as={Row} ref={ref} gutter={GUTTER} $width={width}>
        {children}
      </Styled.Container>
    )
  }
)

BlockGridView.displayName = 'BlockGridView'

export default BlockGridView

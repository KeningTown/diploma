import React, { useMemo } from 'react'
import { Row, Col } from 'antd'

import { getGutter } from '@/ui/theme'

import * as Styled from './FormContent.styled'

const INLINE_GUTTER = getGutter(2, 1)

type Props = {
  inline?: boolean
  small?: boolean
  noVerticalSpace?: boolean
  layout?: number[]
  children: React.ReactNode | React.ReactNode[]
}

const FormContent: React.FC<Props> = ({
  inline = false,
  small = false,
  noVerticalSpace = false,
  layout,
  children
}) => {
  const gutter = useMemo(() => {
    if (inline) {
      return INLINE_GUTTER
    }

    if (small) {
      return getGutter(1)
    }

    return getGutter(3)
  }, [inline, small])

  return (
    <Styled.Container
      as={Row}
      gutter={gutter}
      $inline={inline}
      $noVerticalSpace={noVerticalSpace}
    >
      {(Array.isArray(children) ? children : [children]).map((item, i) => (
        <Col key={i} span={layout?.[i] || (inline ? undefined : 24)}>
          {item}
        </Col>
      ))}
    </Styled.Container>
  )
}

export default FormContent

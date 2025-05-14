import React from 'react'
import { Typography, Alert } from 'antd'

import { ParagraphProps, paragraph } from '../../model'

import * as Styled from './ParagraphText.styled'

type Props = React.PropsWithChildren<{
  type: ParagraphProps.ParagraphType
}>

const ParagraphText: React.FC<Props> = ({ type, children }) => {
  switch (type) {
    case paragraph.constants.ParagraphType.ADDITIONAL:
      return <Styled.Alert as={Alert} type="info" message={children} />
    case paragraph.constants.ParagraphType.REVEALING:
      return <Styled.Alert as={Alert} type="warning" message={children} />
    default:
      return <Styled.Text as={Typography.Paragraph}>{children}</Styled.Text>
  }
}

export default ParagraphText

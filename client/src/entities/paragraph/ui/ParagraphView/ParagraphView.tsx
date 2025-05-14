import React, { useMemo } from 'react'
import { Row, Col, Space } from 'antd'

import { ParagraphProps } from '../../model'
import { Attachment, attachment } from '../../../attachment'

import { getGutter, Size, SIZE } from '@/ui/theme'
import ParagraphText from '../ParagraphText/ParagraphText'

import * as Styled from './ParagraphView.styled'

const GUTTER = getGutter(2)

type Props = React.PropsWithChildren<{
  item: ParagraphProps.Item | ParagraphProps.ItemAvailable
  blockWidth: Size
}>

const ParagraphView: React.FC<Props> = ({ item, blockWidth, children }) => {
  const images = useMemo(
    () =>
      item.attachments
        .filter(
          ({ type }) => type === attachment.constants.AttachmentType.IMAGE
        )
        .sort((a, b) => a.order - b.order),
    [item.attachments]
  )

  const lg = useMemo(() => {
    if (!images.length) {
      return SIZE[Size.XL]
    }

    if (blockWidth === Size.XL || blockWidth === Size.L) {
      return SIZE[item.width] || SIZE[Size.XL]
    }

    return SIZE[Size.XL]
  }, [blockWidth, images.length, item.width])

  const files = useMemo(
    () =>
      item.attachments.filter(
        ({ type }) => type === attachment.constants.AttachmentType.FILE
      ),
    [item.attachments]
  )

  return (
    <Styled.Container as={Row} gutter={GUTTER} $type={item.type}>
      <Col lg={lg} md={SIZE[Size.XL]}>
        <Styled.Space as={Space} direction="vertical" size="small">
          <ParagraphText type={item.type}>{children}</ParagraphText>
          <Attachment.Files items={files} />
        </Styled.Space>
      </Col>
      <Attachment.Images
        items={images}
        blockWidth={blockWidth}
        paragraphWidth={lg}
      />
    </Styled.Container>
  )
}

export default ParagraphView

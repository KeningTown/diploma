import React, { useState, useCallback } from 'react'
import { Card as AntdCard, Col, Image as AntdImage } from 'antd'

import { AttachmentProps } from '../../model'

import { SIZE, Size } from '@/ui/theme'
import { Icon, Card } from '@/ui'

import * as Styled from './Image.styled'

type Props = {
  item: AttachmentProps.Item
  width: number
}

const Image: React.FC<Props> = ({ item, width }) => {
  const [isError, setIsError] = useState(false)

  const handleError = useCallback(() => {
    setIsError(true)
  }, [])

  return (
    <Col lg={width} md={SIZE[Size.XL]}>
      <Styled.Card
        as={Card}
        cover={
          isError ? (
            <Styled.IconContainer>
              <Icon size={32} icon="image" />
            </Styled.IconContainer>
          ) : (
            <AntdImage src={'/files/' + item.filename} onError={handleError} />
          )
        }
      >
        <AntdCard.Meta title={item.title} description={item.description} />
      </Styled.Card>
    </Col>
  )
}

export default Image

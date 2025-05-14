import React, { useMemo } from 'react'
import { Link } from 'react-router-dom'
import { Col } from 'antd'

import { DocumentProps, document } from '@/entities'

import { DOCUMENT } from '@/routes'
import { router } from '@/services'

import { Card } from '@/ui'

import * as Styled from './DocumentCard.styled'

const SM = 24
const MD = SM / 2
const LG = SM / 3
const XXL = SM / 4

type Props = {
  item?: DocumentProps.Item
}

const DocumentCard: React.FC<Props> = ({ item }) => {
  const to = useMemo(() => {
    if (!item) {
      return '#'
    }

    return router.buildPath(DOCUMENT, { id: item.id })
  }, [item])

  return (
    <Col xxl={XXL} lg={LG} md={MD} sm={SM}>
      <Link to={to}>
        <Styled.Card
          as={Card}
          hoverable={Boolean(item)}
          loading={!item}
          title={item?.title}
        >
          {item && document.service.getShortAbstract(item.abstract)}
        </Styled.Card>
      </Link>
    </Col>
  )
}

export default DocumentCard

import React from 'react'
import { Space, Typography } from 'antd'

import { ButtonLink } from '@/ui'

import * as Styled from './PageTitle.styled'

type Props = React.PropsWithChildren<{
  backTo?: string
  backParams?: Record<string, unknown>
  extra?: React.ReactNode
}>

const PageTitle: React.FC<Props> = ({
  backTo,
  backParams,
  extra,
  children
}) => {
  return (
    <Styled.Container>
      <Space>
        {backTo && <ButtonLink back to={backTo} params={backParams} />}
        <Styled.Title as={Typography.Title} level={4}>
          {children}
        </Styled.Title>
      </Space>
      {extra && <Space>{extra}</Space>}
    </Styled.Container>
  )
}

export default PageTitle

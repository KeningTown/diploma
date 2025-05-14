import React, { useMemo } from 'react'
import { Outlet } from 'react-router-dom'
import { Layout } from 'antd'

import { SIDER_WIDTH } from './BaseLayout.constants'

import { useUser } from '@/hooks'

import { Nav, Header } from './components'

import * as Styled from './BaseLayout.styled'

const BaseLayout: React.FC = () => {
  const user = useUser()

  const main = useMemo(
    () => (
      <Styled.Main as={Layout}>
        <Header />
        <Styled.Content as={Layout.Content}>
          <Outlet />
        </Styled.Content>
      </Styled.Main>
    ),
    []
  )

  if (!user) {
    return main
  }

  return (
    <Styled.Container as={Layout} hasSider>
      <Styled.Sider as={Layout.Sider} width={SIDER_WIDTH}>
        <Nav />
      </Styled.Sider>
      {main}
    </Styled.Container>
  )
}

export default BaseLayout

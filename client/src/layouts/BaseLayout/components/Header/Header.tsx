import React from 'react'
import { Layout, Grid } from 'antd'

import Drawer from '../Drawer'
import Logo from '../Logo'
import User from '../User'

import * as Styled from './Header.styled'

const Header: React.FC = () => {
  const { lg } = Grid.useBreakpoint()

  return (
    <Styled.Container as={Layout.Header}>
      {!lg && <Drawer />}
      <Logo />
      <User />
    </Styled.Container>
  )
}

export default Header

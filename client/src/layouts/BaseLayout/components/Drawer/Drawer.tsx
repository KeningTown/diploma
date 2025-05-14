import React, { useState, useCallback } from 'react'
import { Drawer as AntdDrawer } from 'antd'

import { SIDER_WIDTH } from '../../BaseLayout.constants'

import { Button } from '@/ui'
import Nav from '../Nav'

import * as Styled from './Drawer.styled'

const Drawer: React.FC = () => {
  const [open, setOpen] = useState(false)

  const handleOpen = useCallback(() => {
    setOpen(true)
  }, [])

  const handleClose = useCallback(() => {
    setOpen(false)
  }, [])

  return (
    <>
      <Button size="small" type="text" icon="menu" onClick={handleOpen} />
      <Styled.Drawer
        as={AntdDrawer}
        placement="left"
        width={SIDER_WIDTH}
        open={open}
        onClose={handleClose}
      >
        <Nav onClick={handleClose} />
      </Styled.Drawer>
    </>
  )
}

export default Drawer

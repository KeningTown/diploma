import React, { useMemo } from 'react'
import { useLocation } from 'react-router-dom'
import { Menu } from 'antd'

import { Permission } from '@/entities'

import { getItems } from './Nav.constants'

const STYLE = {
  height: '100%',
  border: 'none',
  overflowY: 'auto'
} as const

const defaultOnClick = () => undefined

type Props = {
  onClick?: () => void
}

const Nav: React.FC<Props> = ({ onClick = defaultOnClick }) => {
  const { checkPermissions } = Permission.usePermissionChecker()

  const { pathname } = useLocation()

  const items = useMemo(() => getItems(checkPermissions), [checkPermissions])

  const selectedKeys = useMemo(
    () =>
      items.reduce<string[]>((keys, item) => {
        if (item.children) {
          item.children.forEach((item) => {
            if (pathname.startsWith(item.key)) {
              keys.push(item.key)
            }
          })
        }

        if (pathname.startsWith(item.key)) {
          keys.push(item.key)
        }

        return keys
      }, []),
    [items, pathname]
  )

  return (
    <Menu
      mode="inline"
      // theme="dark"
      inlineIndent={12}
      items={items}
      selectedKeys={selectedKeys}
      style={STYLE}
      onClick={onClick}
    />
  )
}

export default Nav

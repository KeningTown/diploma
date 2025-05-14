import React, { useMemo } from 'react'
import { Link } from 'react-router-dom'
import { Avatar, Dropdown, DropdownProps, Grid } from 'antd'

import { auth } from '@/entities'

import * as routes from '@/routes'

import { useRequest, useUser } from '@/hooks'

import { Icon } from '@/ui'

import * as Styled from './User.styled'

const TRIGGER: DropdownProps['trigger'] = ['click']

const User: React.FC = () => {
  const { lg } = Grid.useBreakpoint()

  const user = useUser()

  const { request: logout, isLoading } = useRequest(auth.api.logout)

  const menu = useMemo<DropdownProps['menu']>(
    () => ({
      items: [
        {
          key: 2,
          label: <Link to={routes.PROFILE}>Профиль</Link>
        },
        {
          key: 3,
          label: 'Выйти',
          danger: true,
          disabled: isLoading,
          onClick: logout
        }
      ]
    }),
    [logout, isLoading]
  )

  if (!user) {
    return null
  }

  return (
    <Dropdown trigger={TRIGGER} placement="bottomRight" menu={menu}>
      <Styled.Avatar
        as={Avatar}
        shape="square"
        size={lg ? 'default' : 'small'}
        icon={<Icon icon="user" />}
      />
    </Dropdown>
  )
}

export default User

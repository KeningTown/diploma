import React, { useMemo } from 'react'
import { Table } from 'antd'

import { UserProps, user } from '../../model'
import { UserRole } from '../../../userRole'
import { UserGroup } from '../../../userGroup'
import { Permission, permission } from '../../../permission'

import { Item, Columns } from './UserList.types'

import { ADMIN_USER } from '@/routes'

import { TagGroup, ButtonLink } from '@/ui'
import { Value } from '@/components'

type Props = {
  isLoading?: boolean
  data?: UserProps.List
}

const UserList: React.FC<Props> = ({ data, isLoading }) => {
  const { checkPermissions } = Permission.usePermissionChecker()

  const dataSource = useMemo(
    () => data?.data.map((item) => ({ ...item, key: item.id })),
    [data?.data]
  )

  const columns = useMemo(() => {
    const columns: Columns = [
      {
        dataIndex: 'id',
        title: user.constants.USER_FIELD_RU.id,
        render: (id: Item['id']) => <Value copy>{id}</Value>
      },
      {
        dataIndex: 'name',
        title: 'ФИО',
        render: (_, item) => (
          <Value inline>{user.service.getFullName(item)}</Value>
        )
      },
      {
        dataIndex: 'email',
        title: user.constants.USER_FIELD_RU.email,
        render: (email: Item['email']) => <Value copy>{email}</Value>
      }
    ]

    const canListUserGroup = checkPermissions({
      [permission.constants.PermissionEntity.USER_GROUP]:
        permission.constants.PermissionAction.LIST
    })

    if (canListUserGroup) {
      columns.push({
        dataIndex: 'groups',
        title: user.constants.USER_FIELD_RU.groups,
        render: (groups: Item['groups']) => (
          <TagGroup>
            {groups?.map((group) => (
              <UserGroup.GroupTag key={group.id} {...group} />
            ))}
          </TagGroup>
        )
      })
    }

    const canListUserRole = checkPermissions({
      [permission.constants.PermissionEntity.USER_ROLE]:
        permission.constants.PermissionAction.LIST
    })

    if (canListUserRole) {
      columns.push({
        dataIndex: 'roles',
        title: user.constants.USER_FIELD_RU.roles,
        render: (roles: Item['roles']) => (
          <TagGroup>
            {roles?.map((role) => <UserRole.RoleTag key={role.id} {...role} />)}
          </TagGroup>
        )
      })
    }

    const canReadUser = checkPermissions({
      [permission.constants.PermissionEntity.USER]:
        permission.constants.PermissionAction.READ
    })

    if (canReadUser) {
      columns.push({
        dataIndex: 'id',
        render: (id: Item['id']) => (
          <ButtonLink to={ADMIN_USER} params={{ id }} />
        )
      })
    }

    return columns
  }, [checkPermissions])

  return (
    <Table
      bordered
      pagination={false}
      size="small"
      loading={isLoading}
      columns={columns}
      dataSource={dataSource}
      rowClassName={(item) => (!item.active ? 'row-disabled' : '')}
    />
  )
}

export default UserList

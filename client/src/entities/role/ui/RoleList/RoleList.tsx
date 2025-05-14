import React, { useMemo } from 'react'
import { Table } from 'antd'

import { RoleProps, role } from '../../model'
import { Permission, permission } from '../../../permission'

import { Data, Columns } from './RoleList.types'

import * as routes from '@/routes'

import { ButtonLink } from '@/ui'
import { Value } from '@/components'

type Props = {
  isLoading: boolean
  data?: RoleProps.List
}

const RoleList: React.FC<Props> = ({ isLoading, data }) => {
  const { checkPermissions } = Permission.usePermissionChecker()

  const dataSource = useMemo<Data[] | undefined>(
    () =>
      data?.data.map((item) => ({
        ...item,
        key: item.id
      })),
    [data]
  )

  const columns = useMemo(() => {
    const columns: Columns = [
      {
        dataIndex: 'id',
        title: role.constants.ROLE_FILED_RU.id,
        render: (id: Data['id']) => <Value copy>{id}</Value>
      },
      {
        dataIndex: 'name',
        title: role.constants.ROLE_FILED_RU.name
      }
    ]

    const canReadRole = checkPermissions({
      [permission.constants.PermissionEntity.ROLE]:
        permission.constants.PermissionAction.READ
    })

    if (canReadRole) {
      columns.push({
        dataIndex: 'id',
        render: (id: Data['id']) => (
          <ButtonLink to={routes.ADMIN_ROLE} params={{ id }} />
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
    />
  )
}

export default RoleList

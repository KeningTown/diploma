import React, { useMemo } from 'react'
import { Table } from 'antd'

import { GroupProps, group } from '../../model'
import { Permission, permission } from '../../../permission'

import { Data, Columns } from './GroupList.types'

import { ADMIN_GROUP } from '@/routes'

import { ButtonLink } from '@/ui'
import { Value } from '@/components'

type Props = {
  isLoading?: boolean
  data?: GroupProps.List
}

const GroupList: React.FC<Props> = ({ data, isLoading }) => {
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
        title: group.constants.GROUP_FILED_RU.id,
        render: (id: Data['id']) => <Value copy>{id}</Value>
      },
      {
        dataIndex: 'name',
        title: group.constants.GROUP_FILED_RU.name
      }
    ]

    const canReadGroup = checkPermissions({
      [permission.constants.PermissionEntity.GROUP]:
        permission.constants.PermissionAction.READ
    })

    if (canReadGroup) {
      columns.push({
        dataIndex: 'id',
        render: (id: Data['id']) => (
          <ButtonLink to={ADMIN_GROUP} params={{ id }} />
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

export default GroupList

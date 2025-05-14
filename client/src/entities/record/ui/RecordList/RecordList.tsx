import React, { useMemo } from 'react'
import { Table } from 'antd'

import { TableColumns } from '@/types'

import { RecordProps, record } from '../../model'
import { user } from '../../../user'
import { Permission, permission } from '../../../permission'

import { ADMIN_USER, ADMIN_DOCUMENT, ADMIN_RECORD } from '@/routes'

import { Value, ValueType } from '@/components'
import { ButtonLink } from '@/ui'

type Props = {
  isLoading?: boolean
  data?: RecordProps.List
}

const RecordList: React.FC<Props> = ({ isLoading, data }) => {
  const { checkPermissions } = Permission.usePermissionChecker()

  const dataSource = useMemo(
    () => data?.data.map((item) => ({ ...item, key: item.id })),
    [data?.data]
  )

  const columns = useMemo(() => {
    const canReadUser = checkPermissions({
      [permission.constants.PermissionEntity.USER]:
        permission.constants.PermissionAction.READ
    })
    const canReadDocument = checkPermissions({
      [permission.constants.PermissionEntity.DOCUMENT]:
        permission.constants.PermissionAction.READ
    })
    const columns: TableColumns<RecordProps.Item> = [
      {
        dataIndex: 'id',
        title: record.constants.FIELD_RU.id,
        render: (id) => <Value copy>{id}</Value>
      },
      {
        dataIndex: 'user',
        title: record.constants.FIELD_RU.user,
        render: (item) => (
          <Value
            type={canReadUser ? ValueType.LINK : undefined}
            to={ADMIN_USER}
            params={{ id: item.id }}
          >
            {user.service.getShortName(item)}
          </Value>
        )
      },
      {
        dataIndex: 'document',
        title: record.constants.FIELD_RU.document,
        render: (document) => (
          <Value
            type={canReadDocument ? ValueType.LINK : undefined}
            to={ADMIN_DOCUMENT}
            params={{ id: document.id }}
          >
            {document.title}
          </Value>
        )
      },
      {
        dataIndex: 'createdAt',
        title: record.constants.FIELD_RU.createdAt,
        render: (createdAt) => <Value type={ValueType.DATE}>{createdAt}</Value>
      }
    ]

    const canReadRecord = checkPermissions({
      [permission.constants.PermissionEntity.RECORD]:
        permission.constants.PermissionAction.READ
    })

    if (canReadRecord) {
      columns.push({
        dataIndex: 'id',
        render: (id) => <ButtonLink to={ADMIN_RECORD} params={{ id }} />
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

export default RecordList

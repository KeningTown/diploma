import React, { useMemo } from 'react'
import { Table, Typography, Tag, Badge, TableProps } from 'antd'

import { PermissionProps, permission } from '../../model'

import * as Styled from './PermissionTable.styled'

type Data = Record<string, string | boolean>
type Columns = TableProps<Data>['columns']

type Props = {
  permissions: PermissionProps.Collection
}

const PermissionTable: React.FC<Props> = ({ permissions }) => {
  const columns = useMemo(() => {
    const columns: Columns = Object.values(
      permission.constants.PermissionAction
    ).map((action) => {
      const color = permission.constants.PERMISSION_ACTION_COLOR[action]
      const name = permission.constants.PERMISSION_ACTION_RU[action]

      return {
        dataIndex: action,
        title: <Tag color={color}>{name}</Tag>,
        align: 'center',
        render: (value: boolean) => {
          return value && <Badge status="success" />
        }
      }
    })

    return [
      {
        dataIndex: 'entity',
        title: 'Сущность'
      },
      ...columns
    ]
  }, [])

  const dataSource = useMemo(() => {
    return Object.values(permission.constants.PermissionEntity).map(
      (entity) => {
        const actions = Object.fromEntries(
          Object.values(permission.constants.PermissionAction).map((action) => {
            const value = Boolean(
              permissions.find((item) => {
                return item.entity === entity && item.action === action
              })
            )

            return [action, value]
          })
        )

        return {
          key: entity,
          entity: permission.constants.PERMISSION_ENTITY_RU[entity],
          ...actions
        }
      }
    )
  }, [permissions])

  return (
    <Styled.Container>
      <Typography.Paragraph strong>Разрешения</Typography.Paragraph>
      <Table
        bordered
        size="small"
        pagination={false}
        columns={columns}
        dataSource={dataSource}
      />
    </Styled.Container>
  )
}

export default PermissionTable

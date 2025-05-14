import React, { useMemo } from 'react'

import { RecordProps, record } from '../../model'
import { user } from '../../../user'
import { Permission, permission } from '../../../permission'

import { ADMIN_USER, ADMIN_DOCUMENT } from '@/routes'

import { Details } from '@/ui'
import { Value, ValueType } from '@/components'

type Props = {
  item: RecordProps.ItemFull
}

const RecordInfo: React.FC<Props> = ({ item }) => {
  const { checkPermissions } = Permission.usePermissionChecker()

  const items = useMemo(() => {
    const canReadUser = checkPermissions({
      [permission.constants.PermissionEntity.USER]:
        permission.constants.PermissionAction.READ
    })
    const canReadDocument = checkPermissions({
      [permission.constants.PermissionEntity.DOCUMENT]:
        permission.constants.PermissionAction.READ
    })

    return [
      {
        label: record.constants.FIELD_RU.id,
        children: <Value copy>{item.id}</Value>
      },
      {
        label: record.constants.FIELD_RU.user,
        children: (
          <Value
            type={canReadUser ? ValueType.LINK : undefined}
            to={ADMIN_USER}
            params={{ id: item.user.id }}
          >
            {user.service.getShortName(item.user)}
          </Value>
        )
      },
      {
        label: record.constants.FIELD_RU.document,
        children: (
          <Value
            type={canReadDocument ? ValueType.LINK : undefined}
            to={ADMIN_DOCUMENT}
            params={{ id: item.document.id }}
          >
            {item.document.title}
          </Value>
        )
      },
      {
        label: record.constants.FIELD_RU.createdAt,
        children: <Value type={ValueType.DATE}>{item.createdAt}</Value>
      }
    ]
  }, [item, checkPermissions])

  return <Details items={items} />
}

export default RecordInfo

import React, { useMemo } from 'react'
import { DescriptionsProps } from 'antd'

import { RoleProps, role } from '../../model'
import { UserRole } from '../../../userRole'
import { Permission, permission } from '../../../permission'

import { Details, TagGroup } from '@/ui'
import { Fetcher, Value } from '@/components'

type Props = {
  item: RoleProps.Item
}

const RoleInfo: React.FC<Props> = ({ item }) => {
  const { checkPermissions } = Permission.usePermissionChecker()

  const items = useMemo(() => {
    const items: DescriptionsProps['items'] = [
      {
        label: role.constants.ROLE_FILED_RU.id,
        children: <Value copy>{item.id}</Value>
      },
      {
        label: role.constants.ROLE_FILED_RU.type,
        children: role.constants.ROLE_TYPE_RU[item.type]
      },
      {
        label: role.constants.ROLE_FILED_RU.name,
        children: item.name
      }
    ]

    const canListUserRole = checkPermissions({
      [permission.constants.PermissionEntity.USER_ROLE]:
        permission.constants.PermissionAction.LIST
    })

    if (canListUserRole) {
      const canCreateUserRole = checkPermissions({
        [permission.constants.PermissionEntity.USER_ROLE]:
          permission.constants.PermissionAction.CREATE
      })
      const canDeleteUserRole = checkPermissions({
        [permission.constants.PermissionEntity.USER_ROLE]:
          permission.constants.PermissionAction.DELETE
      })

      items.push({
        label: 'Пользователи',
        children: (
          <Fetcher loader fromPath request={role.api.listUsers}>
            {({ data, reload }) => (
              <TagGroup
                addModalHidden={!canCreateUserRole}
                addModal={(props) => (
                  <UserRole.AddUsersModal
                    {...props}
                    roleId={item.id}
                    excluded={data.data.map((item) => item.user.id)}
                    onSuccess={reload}
                  />
                )}
              >
                {data.data.map((roleUser) => (
                  <UserRole.UserTag
                    key={roleUser.id}
                    {...roleUser}
                    onRemove={canDeleteUserRole && reload}
                  />
                ))}
              </TagGroup>
            )}
          </Fetcher>
        )
      })
    }

    return items
  }, [checkPermissions, item])

  return <Details items={items} />
}

export default RoleInfo

import React, { useMemo } from 'react'
import { DescriptionsProps } from 'antd'

import { UserGroup } from '../../../userGroup'
import { GroupProps, group } from '../../model'
import { Permission, permission } from '../../../permission'

import { Details, TagGroup } from '@/ui'
import { Value, Fetcher } from '@/components'

type Props = {
  item: GroupProps.Item
}

const GroupInfo: React.FC<Props> = ({ item }) => {
  const { checkPermissions } = Permission.usePermissionChecker()

  const items = useMemo(() => {
    const items: DescriptionsProps['items'] = [
      {
        label: group.constants.GROUP_FILED_RU.id,
        children: <Value copy>{item.id}</Value>
      },
      {
        label: group.constants.GROUP_FILED_RU.name,
        children: item.name
      }
    ]

    const canListUserGroup = checkPermissions({
      [permission.constants.PermissionEntity.USER_GROUP]:
        permission.constants.PermissionAction.LIST
    })

    if (canListUserGroup) {
      const canCreateUserGroup = checkPermissions({
        [permission.constants.PermissionEntity.USER_GROUP]:
          permission.constants.PermissionAction.CREATE
      })
      const canDeleteUserGroup = checkPermissions({
        [permission.constants.PermissionEntity.USER_GROUP]:
          permission.constants.PermissionAction.DELETE
      })

      items.push({
        label: 'Пользователи',
        children: (
          <Fetcher loader fromPath request={group.api.listUsers}>
            {({ data, reload }) => (
              <TagGroup
                addModalHidden={!canCreateUserGroup}
                addModal={(props) => (
                  <UserGroup.AddUsersModal
                    {...props}
                    groupId={item.id}
                    excluded={data.data.map((item) => item.user.id)}
                    onSuccess={reload}
                  />
                )}
              >
                {data.data.map((groupUser) => (
                  <UserGroup.UserTag
                    key={groupUser.id}
                    {...groupUser}
                    onRemove={canDeleteUserGroup && reload}
                  />
                ))}
              </TagGroup>
            )}
          </Fetcher>
        )
      })
    }

    return items
  }, [item, checkPermissions])

  return <Details title={item.name} items={items} />
}

export default GroupInfo

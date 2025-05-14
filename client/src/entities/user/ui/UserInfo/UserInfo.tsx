import React, { useMemo } from 'react'
import { DescriptionsProps, Badge } from 'antd'

import { UserProps, user } from '../../model'
import { UserRole } from '../../../userRole'
import { UserGroup } from '../../../userGroup'
import { Permission, permission } from '../../../permission'

import { useUser } from '@/hooks'

import { TagGroup, Details } from '@/ui'
import { Fetcher, Value } from '@/components'

type Props = {
  isProfile?: boolean
  item: UserProps.Item
}

const UserInfo: React.FC<Props> = ({ isProfile, item }) => {
  const { checkPermissions } = Permission.usePermissionChecker()

  const me = useUser()

  const items = useMemo(() => {
    const items: DescriptionsProps['items'] = [
      {
        label: user.constants.USER_FIELD_RU.id,
        children: <Value copy={!isProfile}>{item.id}</Value>
      },
      {
        label: user.constants.USER_FIELD_RU.lastName,
        children: item.lastName
      },
      {
        label: user.constants.USER_FIELD_RU.firstName,
        children: item.firstName
      },
      {
        label: user.constants.USER_FIELD_RU.middleName,
        children: item.middleName
      },
      {
        label: user.constants.USER_FIELD_RU.email,
        children: <Value copy={!isProfile}>{item.email}</Value>
      }
    ]

    if (isProfile) {
      items.push(
        {
          label: user.constants.USER_FIELD_RU.roles,
          children: (
            <TagGroup>
              {me?.roles?.map((userRole) => (
                <UserRole.RoleTag key={userRole.id} {...userRole} noLink />
              ))}
            </TagGroup>
          )
        },
        {
          label: user.constants.USER_FIELD_RU.groups,
          children: (
            <TagGroup>
              {me?.groups?.map((userGroup) => (
                <UserGroup.GroupTag key={userGroup.id} {...userGroup} noLink />
              ))}
            </TagGroup>
          )
        }
      )
    } else {
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
          label: user.constants.USER_FIELD_RU.roles,
          children: (
            <Fetcher loader request={user.api.listRoles} args={[item.id]}>
              {({ data, reload }) => (
                <TagGroup
                  addModalHidden={!canCreateUserRole}
                  addModal={(props) => (
                    <UserRole.AddRolesModal
                      {...props}
                      userId={item.id}
                      excluded={data.data.map((item) => item.role.id)}
                      onSuccess={reload}
                    />
                  )}
                >
                  {data.data.map((userRole) => (
                    <UserRole.RoleTag
                      key={userRole.id}
                      {...userRole}
                      onRemove={canDeleteUserRole && reload}
                    />
                  ))}
                </TagGroup>
              )}
            </Fetcher>
          )
        })
      }

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
          label: user.constants.USER_FIELD_RU.groups,
          children: (
            <Fetcher loader request={user.api.listGroups} args={[item.id]}>
              {({ data, reload }) => (
                <TagGroup
                  addModalHidden={!canCreateUserGroup}
                  addModal={(props) => (
                    <UserGroup.AddGroupsModal
                      {...props}
                      userId={item.id}
                      excluded={data.data.map((item) => item.group.id)}
                      onSuccess={reload}
                    />
                  )}
                >
                  {data.data.map((userGroup) => (
                    <UserGroup.GroupTag
                      key={userGroup.id}
                      {...userGroup}
                      onRemove={canDeleteUserGroup && reload}
                    />
                  ))}
                </TagGroup>
              )}
            </Fetcher>
          )
        })
      }
    }

    return items
  }, [item, isProfile, me, checkPermissions])

  return (
    <Details
      title={
        <Badge
          status={item.active ? 'success' : 'error'}
          text={user.service.getFullName(item)}
        />
      }
      items={items}
    />
  )
}

export default UserInfo

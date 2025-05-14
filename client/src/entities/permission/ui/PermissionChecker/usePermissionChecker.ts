import { useCallback } from 'react'

import { Permissions } from './PermissionChecker.types'

import {
  PermissionEntity,
  PermissionAction
} from '../../model/permission.constants'

import { useUser } from '@/hooks'

export const usePermissionChecker = () => {
  const user = useUser()

  const checkPermission = useCallback(
    (e: PermissionEntity, a: PermissionAction) => {
      return user?.roles?.some(({ role }) => {
        return role.permissions?.some(({ entity, action }) => {
          return entity === e && action === a
        })
      })
    },
    [user?.roles]
  )

  const checkPermissions = useCallback(
    (permissions: Permissions) => {
      return Object.entries(permissions).every(([e, a]) => {
        if (typeof a === 'string') {
          return checkPermission(e as PermissionEntity, a)
        }

        return a.every((a) => {
          return checkPermission(e as PermissionEntity, a)
        })
      })
    },
    [checkPermission]
  )

  return {
    checkPermissions
  }
}

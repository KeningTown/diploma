import { PermissionProps } from '../../model'

export type Permissions = Partial<
  Record<
    PermissionProps.PermissionEntity,
    PermissionProps.PermissionAction | PermissionProps.PermissionAction[]
  >
>

export type CheckPermissions = (permissions: Permissions) => boolean

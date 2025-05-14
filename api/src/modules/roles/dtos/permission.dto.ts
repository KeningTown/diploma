import { RolesPermissions } from '../../roles-permissions/roles.permissions.entity'

export class PermissionDto {
  id!: number

  action!: string

  entity!: string

  constructor(rolesPermissions: RolesPermissions) {
    this.id = rolesPermissions.permission.id
    this.action = rolesPermissions.permission.action
    this.entity = rolesPermissions.permission.entity
  }
}

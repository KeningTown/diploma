import { UsersRoles } from '../../users-roles/users.roles.entity'
import { Permission } from '../../permissions/permission.entity'

export class UserRoleDto {
  id: number
  name: string
  type: string
  permissions?: Pick<Permission, 'id' | 'entity' | 'action'>[]

  constructor(usersRoles: UsersRoles) {
    this.id = usersRoles.role.id
    this.name = usersRoles.role.name
    this.type = usersRoles.role.type

    if (usersRoles.role.rolesPermissions.isInitialized()) {
      this.permissions = usersRoles.role.rolesPermissions.map(
        (rolePermission) => ({
          id: rolePermission.permission.id,
          entity: rolePermission.permission.entity,
          action: rolePermission.permission.action
        })
      )
    }
  }
}

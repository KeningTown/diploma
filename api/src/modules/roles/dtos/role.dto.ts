import { Role } from '../role.entity'
import { PermissionDto } from './permission.dto'

export class RoleDto {
  id!: number

  name!: string

  type!: string

  permissions!: PermissionDto[]

  constructor(role: Role) {
    this.id = role.id
    this.name = role.name
    this.type = role.type
    this.permissions = role.rolesPermissions.map(
      (rolePermissions) => new PermissionDto(rolePermissions)
    )
  }
}

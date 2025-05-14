import { UserRoleDto } from './userRole.dto'
import { UsersRoles } from '../../users-roles/users.roles.entity'

export class UsersRolesDto {
  id: number
  role: UserRoleDto

  constructor(usersRoles: UsersRoles) {
    this.id = usersRoles.id
    this.role = new UserRoleDto(usersRoles)
  }
}

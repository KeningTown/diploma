import { RoleUserDto } from './roleUser.dto'

import { UsersRoles } from '../../users-roles/users.roles.entity'

export class RoleUsersDto {
  id: number
  user: RoleUserDto

  constructor(usersRoles: UsersRoles) {
    this.id = usersRoles.id
    this.user = new RoleUserDto(usersRoles.user)
  }
}

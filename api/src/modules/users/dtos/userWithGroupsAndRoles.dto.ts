import { User } from '../user.entity'

import { UserDto } from './user.dto'
import { UsersGroupsDto } from './usersGroups.dto'
import { UsersRolesDto } from './usersRoles.dto'

export class UserWithGroupsAndRolesDto extends UserDto {
  groups: UsersGroupsDto[]
  roles: UsersRolesDto[]

  constructor(user: User) {
    super(user)
    this.groups = user.usersGroups.map(
      (userGroups) => new UsersGroupsDto(userGroups)
    )
    this.roles = user.usersRoles.map(
      (usersRoles) => new UsersRolesDto(usersRoles)
    )
  }
}

import { GroupUserDto } from './groupUser.dto'

import { UsersGroups } from '../../users-groups/users.groups.entity'

export class GroupUsersDto {
  id: number
  user: GroupUserDto

  constructor(usersGroups: UsersGroups) {
    this.id = usersGroups.id
    this.user = new GroupUserDto(usersGroups.user)
  }
}

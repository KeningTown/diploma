import { UserGroupDto } from './userGroup.dto'
import { UsersGroups } from '../../users-groups/users.groups.entity'

export class UsersGroupsDto {
  id!: number

  group!: UserGroupDto

  constructor(usersGroups: UsersGroups) {
    this.id = usersGroups.id
    this.group = new UserGroupDto(usersGroups)
  }
}

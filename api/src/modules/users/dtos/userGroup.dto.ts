import { UsersGroupsDto } from './usersGroups.dto'

export class UserGroupDto {
  id!: number

  name!: string

  constructor(usersGroups: UsersGroupsDto) {
    this.id = usersGroups.group.id
    this.name = usersGroups.group.name
  }
}

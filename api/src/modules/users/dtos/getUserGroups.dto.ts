import { PageDto } from '../../common/dtos/page.dto'
import { UsersGroupsDto } from './usersGroups.dto'

export class GetUserGroupsDto {
  readonly data!: UsersGroupsDto[]

  readonly nav!: PageDto

  constructor(data: UsersGroupsDto[], nav: PageDto) {
    this.data = data
    this.nav = nav
  }
}

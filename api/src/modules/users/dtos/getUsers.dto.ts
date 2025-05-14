import { PageDto } from '../../common/dtos/page.dto'
import { UserWithGroupsAndRolesDto } from './userWithGroupsAndRoles.dto'

export class GetUsersDto {
  readonly data!: UserWithGroupsAndRolesDto[]

  readonly nav!: PageDto

  constructor(data: UserWithGroupsAndRolesDto[], nav: PageDto) {
    this.data = data
    this.nav = nav
  }
}

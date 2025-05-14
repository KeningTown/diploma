import { PageDto } from '../../common/dtos/page.dto'
import { UsersRolesDto } from './usersRoles.dto'

export class GetUserRolesDto {
  readonly data!: UsersRolesDto[]

  readonly nav!: PageDto

  constructor(data: UsersRolesDto[], nav: PageDto) {
    this.data = data
    this.nav = nav
  }
}

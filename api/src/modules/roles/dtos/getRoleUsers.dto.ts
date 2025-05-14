import { PageDto } from '../../common/dtos/page.dto'
import { RoleUsersDto } from './roleUsers.dto'

export class GetRoleUsersDto {
  readonly data!: RoleUsersDto[]

  readonly nav!: PageDto

  constructor(data: RoleUsersDto[], nav: PageDto) {
    this.data = data
    this.nav = nav
  }
}

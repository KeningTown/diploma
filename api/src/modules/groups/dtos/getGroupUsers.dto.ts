import { PageDto } from '../../common/dtos/page.dto'
import { GroupUsersDto } from './groupUsers.dto'

export class GetGroupUsersDto {
  readonly data!: GroupUsersDto[]

  readonly nav!: PageDto

  constructor(data: GroupUsersDto[], nav: PageDto) {
    this.data = data
    this.nav = nav
  }
}

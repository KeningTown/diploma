import { PageDto } from '../../common/dtos/page.dto'
import { RoleDto } from './role.dto'

export class GetRolesDto {
  readonly data!: RoleDto[]

  readonly nav!: PageDto

  constructor(data: RoleDto[], nav: PageDto) {
    this.data = data
    this.nav = nav
  }
}

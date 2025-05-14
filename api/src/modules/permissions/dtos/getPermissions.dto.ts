import { PageDto } from '../../common/dtos/page.dto'
import { PermissionDto } from './permission.dto'

export class GetPermissionsDto {
  readonly data!: PermissionDto[]

  readonly nav!: PageDto

  constructor(data: PermissionDto[], nav: PageDto) {
    this.data = data
    this.nav = nav
  }
}

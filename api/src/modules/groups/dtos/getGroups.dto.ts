import { PageDto } from '../../common/dtos/page.dto'
import { GroupDto } from './group.dto'

export class GetGroupsDto {
  readonly data!: GroupDto[]

  readonly nav!: PageDto

  constructor(data: GroupDto[], nav: PageDto) {
    this.data = data
    this.nav = nav
  }
}

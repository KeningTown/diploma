import { PageDto } from '../../common/dtos/page.dto'
import { DocumentsGroupsDto } from './documentsGroups.dto'

export class GetDocumentGroupsDto {
  readonly data!: DocumentsGroupsDto[]

  readonly nav!: PageDto

  constructor(data: DocumentsGroupsDto[], nav: PageDto) {
    this.data = data
    this.nav = nav
  }
}

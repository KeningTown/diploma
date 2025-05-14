import { PageDto } from '../../common/dtos/page.dto'
import { DocumentDto } from './document.dto'

export class GetDocumentsDto {
  readonly data!: DocumentDto[]

  readonly nav!: PageDto

  constructor(data: DocumentDto[], nav: PageDto) {
    this.data = data
    this.nav = nav
  }
}

import { PageDto } from '../../common/dtos/page.dto'
import { DocumentBlockDto } from './documentBlocks.dto'

export class GetDocumentBlocksDto {
  readonly data!: DocumentBlockDto[]

  readonly nav!: PageDto

  constructor(data: DocumentBlockDto[], nav: PageDto) {
    this.data = data
    this.nav = nav
  }
}

import { Type } from 'class-transformer'

export class GetDocumentsQueryParams {
  @Type(() => Number)
  limit = 50

  @Type(() => Number)
  offset = 0
}

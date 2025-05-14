import { Type } from 'class-transformer'

export class GetGroupsQueryParams {
  @Type(() => Number)
  limit = 50

  @Type(() => Number)
  offset = 0
}

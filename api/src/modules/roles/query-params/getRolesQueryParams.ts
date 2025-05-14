import { Type } from 'class-transformer'

export class GetRolesQueryParams {
  @Type(() => Number)
  limit = 50

  @Type(() => Number)
  offset = 0
}

import { Type } from 'class-transformer'

export class GetPermissionsQueryParams {
  @Type(() => Number)
  limit = 50

  @Type(() => Number)
  offset = 0
}

import { Type } from 'class-transformer'

export class GetUsersQueryParams {
  @Type(() => Number)
  limit = 50

  @Type(() => Number)
  offset = 0

  @Type(() => String)
  isActive?: boolean

  @Type(() => Number)
  userIds?: number[]

  @Type(() => String)
  name?: string
}

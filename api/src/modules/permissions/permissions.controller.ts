import {
  ClassSerializerInterceptor,
  Controller,
  Get,
  Query,
  UseGuards,
  UseInterceptors
} from '@nestjs/common'
import { GetPermissionsQueryParams } from './query-params/getPermissionsQueryParams'
import PermissionsService from './permissions.service'
import { AccessTokenGuard } from '../common/guards/accessToken.guard'

@UseInterceptors(ClassSerializerInterceptor)
@UseGuards(AccessTokenGuard)
@Controller('api/permissions')
export default class PermissionsController {
  constructor(private readonly permissionsService: PermissionsService) {}

  @Get()
  async getPermissions(@Query() queryParams: GetPermissionsQueryParams) {
    return await this.permissionsService.getPermissions(
      queryParams.limit,
      queryParams.offset
    )
  }
}

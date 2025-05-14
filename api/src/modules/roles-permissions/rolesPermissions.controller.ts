import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Delete,
  Param,
  ParseIntPipe,
  Post,
  UseGuards,
  UseInterceptors
} from '@nestjs/common'
import RolesPermissionsService from './rolesPermissions.service'
import { AddRolesPermissionsDto } from './dtos/addRolesPermissionsDto'
import { AccessTokenGuard } from '../common/guards/accessToken.guard'

@UseInterceptors(ClassSerializerInterceptor)
@UseGuards(AccessTokenGuard)
@Controller('api/rolesPermissions')
export default class RolesPermissionsController {
  constructor(
    private readonly rolesPermissionsService: RolesPermissionsService
  ) {}

  @Post()
  async addRolesPermissions(@Body() body: AddRolesPermissionsDto) {
    return await this.rolesPermissionsService.addRolesPermissions(body)
  }

  @Delete('/:rolePermissionId')
  async deleteRolePermissions(
    @Param('rolePermissionId', ParseIntPipe) id: number
  ) {
    return await this.rolesPermissionsService.deleteRolesPermissions(id)
  }
}

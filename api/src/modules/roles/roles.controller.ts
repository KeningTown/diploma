import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  UseGuards,
  UseInterceptors
} from '@nestjs/common'
import RolesService from './roles.service'
import { GetRolesQueryParams } from './query-params/getRolesQueryParams'
import { RoleItem } from './dtos/addRole.dto'
import { UpdateRoleDto } from './dtos/updateRole.dto'
import { AccessTokenGuard } from '../common/guards/accessToken.guard'

@UseInterceptors(ClassSerializerInterceptor)
@UseGuards(AccessTokenGuard)
@Controller('api/roles')
export default class RolesController {
  constructor(private readonly rolesService: RolesService) {}

  @Get()
  async getRoles(@Query() queryParams: GetRolesQueryParams) {
    return await this.rolesService.getRoles(
      queryParams.limit,
      queryParams.offset
    )
  }

  @Get('/:roleId')
  async getRole(@Param('roleId', ParseIntPipe) id: number) {
    return await this.rolesService.getRole(id)
  }

  @Get('/:roleId/users')
  async getRoleUsers(
    @Param('roleId', ParseIntPipe) id: number,
    @Query() queryParams: GetRolesQueryParams
  ) {
    return await this.rolesService.getRoleUsers(
      id,
      queryParams.limit,
      queryParams.offset
    )
  }

  @Post()
  async addRole(@Body() body: RoleItem) {
    return await this.rolesService.addRole(body)
  }

  @Patch('/:roleId')
  async updateRole(
    @Param('roleId', ParseIntPipe) id: number,
    @Body() body: UpdateRoleDto
  ) {
    return await this.rolesService.updateRole(id, body)
  }

  @Delete('/:roleId')
  async deleteRole(@Param('roleId', ParseIntPipe) id: number) {
    return await this.rolesService.deleteRole(id)
  }
}

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

import { UserRoleCollection } from './userRole.types'

import UsersRolesService from './usersRoles.service'
import { AccessTokenGuard } from '../common/guards/accessToken.guard'

@UseInterceptors(ClassSerializerInterceptor)
@UseGuards(AccessTokenGuard)
@Controller('api/rolesUsers')
export default class UsersRolesController {
  constructor(private readonly usersRolesService: UsersRolesService) {}

  @Post()
  async addUser(@Body() body: UserRoleCollection) {
    return await this.usersRolesService.addUsersRoles(body)
  }

  @Delete('/:userRoleId')
  async deleteGroup(@Param('userRoleId', ParseIntPipe) id: number) {
    return await this.usersRolesService.deleteUsersRoles(id)
  }
}

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

import { UserGroupCollection } from './userGroup.types'

import UsersGroupsService from './usersGroups.service'
import { AccessTokenGuard } from '../common/guards/accessToken.guard'

@UseInterceptors(ClassSerializerInterceptor)
@UseGuards(AccessTokenGuard)
@Controller('api/groupsUsers')
export default class UsersGroupsController {
  constructor(private readonly usersGroupsService: UsersGroupsService) {}

  @Post()
  async addUser(@Body() body: UserGroupCollection) {
    return await this.usersGroupsService.addUsersGroups(body)
  }

  @Delete('/:userGroupId')
  async deleteGroup(@Param('userGroupId', ParseIntPipe) id: number) {
    return await this.usersGroupsService.deleteUsersGroups(id)
  }
}

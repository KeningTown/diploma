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
import GroupsService from './groups.service'
import { GetGroupsQueryParams } from './query-params/getGroupsQueryParams'
import { AddGroupDto } from './dtos/addGroup.dto'
import { UpdateGroupDto } from './dtos/updateGroup.dto'
import { AccessTokenGuard } from '../common/guards/accessToken.guard'

@UseInterceptors(ClassSerializerInterceptor)
@UseGuards(AccessTokenGuard)
@Controller('api/groups')
export default class GroupsController {
  constructor(private readonly groupsService: GroupsService) {}

  @Get()
  async getGroups(@Query() queryParams: GetGroupsQueryParams) {
    return await this.groupsService.getGroups(
      queryParams.limit,
      queryParams.offset
    )
  }

  @Get('/:groupId')
  async getGroup(@Param('groupId', ParseIntPipe) id: number) {
    return await this.groupsService.getGroup(id)
  }

  @Get('/:groupId/users')
  async getGroupUsers(
    @Param('groupId', ParseIntPipe) id: number,
    @Query() queryParams: GetGroupsQueryParams
  ) {
    return await this.groupsService.getGroupUsers(
      id,
      queryParams.limit,
      queryParams.offset
    )
  }

  @Post()
  async addGroup(@Body() body: AddGroupDto) {
    return await this.groupsService.addGroup(body)
  }

  @Patch('/:groupId')
  async updateGroup(
    @Param('groupId', ParseIntPipe) id: number,
    @Body() body: UpdateGroupDto
  ) {
    return await this.groupsService.updateGroup(id, body)
  }

  @Delete('/:groupId')
  async deleteGroup(@Param('groupId', ParseIntPipe) id: number) {
    return await this.groupsService.deleteGroup(id)
  }
}

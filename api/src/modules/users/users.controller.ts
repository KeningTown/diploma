import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  UseInterceptors,
  HttpException,
  HttpStatus,
  UseGuards
} from '@nestjs/common'
import { NotFoundError } from '@mikro-orm/core'

import UsersService from './users.service'

import { GetUsersQueryParams } from './query-params/getUsersQueryParams'

import { AddUserDto } from './dtos/addUser.dto'
import { UpdateUserDto } from './dtos/updateUser.dto'
import { AccessTokenGuard } from '../common/guards/accessToken.guard'

@UseInterceptors(ClassSerializerInterceptor)
@UseGuards(AccessTokenGuard)
@Controller('api/users')
export default class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  async getUsers(@Query() queryParams: GetUsersQueryParams) {
    return await this.usersService.getUsers(
      queryParams.limit,
      queryParams.offset,
      queryParams.isActive,
      queryParams.userIds,
      queryParams.name
    )
  }

  @Get('/:userId')
  async getUser(@Param('userId', ParseIntPipe) id: number) {
    try {
      return await this.usersService.getUser(id)
    } catch (e) {
      // TODO: разобраться, как правильно / лучше обрабатывать ошибки

      const status =
        e instanceof NotFoundError
          ? HttpStatus.NOT_FOUND
          : HttpStatus.BAD_REQUEST

      throw new HttpException({ message: e.message }, status)
    }
  }

  @Get('/:userId/roles')
  async getUserRoles(
    @Param('userId', ParseIntPipe) id: number,
    @Query() queryParams: GetUsersQueryParams
  ) {
    return await this.usersService.getUserRoles(
      id,
      queryParams.limit,
      queryParams.offset
    )
  }

  @Get('/:userId/groups')
  async getUserGroups(
    @Param('userId', ParseIntPipe) id: number,
    @Query() queryParams: GetUsersQueryParams
  ) {
    return await this.usersService.getUserGroups(
      id,
      queryParams.limit,
      queryParams.offset
    )
  }

  @UseGuards(AccessTokenGuard)
  @Post()
  async addUser(@Body() body: AddUserDto) {
    return await this.usersService.addUser(body)
  }

  @Patch('/:userId')
  async updateUser(
    @Param('userId', ParseIntPipe) id: number,
    @Body() body: UpdateUserDto
  ) {
    return await this.usersService.updateUser(id, body)
  }

  @Patch('/:id/changePassword')
  async changeUserPassword(@Param('id', ParseIntPipe) id: number) {
    return await this.usersService.changePassword(id)
  }
}

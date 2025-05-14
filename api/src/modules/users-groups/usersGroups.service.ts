import { HttpException, HttpStatus, Injectable } from '@nestjs/common'
import { InjectRepository } from '@mikro-orm/nestjs'
import { EntityRepository } from '@mikro-orm/core'
import { EntityManager } from '@mikro-orm/postgresql'

import { UserGroupCollection } from './userGroup.types'

import { UsersGroups } from './users.groups.entity'

import { AddEntityResultDto } from '../common/dtos/addEntityResult.dto'
import { DeleteEntityResultFailDto } from '../common/dtos/deleteEntityResultFail.dto'
import { DeleteEntityResultSuccessDto } from '../common/dtos/deleteEntityResultSuccess.dto'

@Injectable()
export default class UsersGroupsService {
  constructor(
    @InjectRepository(UsersGroups)
    private readonly usersGroupsRepository: EntityRepository<UsersGroups>,
    private readonly em: EntityManager
  ) {}

  async addUsersGroups(body: UserGroupCollection) {
    try {
      const data = body.map(({ userId: user, groupId: group }) =>
        this.usersGroupsRepository.create({ user, group })
      )

      await this.em.flush()

      return new AddEntityResultDto({ data })
    } catch (e) {
      throw new HttpException(
        new AddEntityResultDto({
          errorMessage: 'Error description: ' + e.message
        }),
        HttpStatus.BAD_REQUEST
      )
    }
  }

  async deleteUsersGroups(id: number) {
    const usersGroups = await this.em.findOne(UsersGroups, { id: id })
    if (usersGroups == null) {
      throw new HttpException(
        new DeleteEntityResultFailDto('Specified user-group does not exist!'),
        HttpStatus.BAD_REQUEST
      )
    }
    try {
      await this.em.nativeDelete(UsersGroups, { id: id })
      await this.em.flush()
      return new DeleteEntityResultSuccessDto()
    } catch (e) {
      throw new HttpException(
        new DeleteEntityResultFailDto('Error description: ' + e.message),
        HttpStatus.BAD_REQUEST
      )
    }
  }
}

import { HttpException, HttpStatus, Injectable } from '@nestjs/common'
import { InjectRepository } from '@mikro-orm/nestjs'
import { EntityRepository } from '@mikro-orm/core'
import { EntityManager } from '@mikro-orm/postgresql'

import { UserRoleCollection } from './userRole.types'

import { AddEntityResultDto } from '../common/dtos/addEntityResult.dto'
import { DeleteEntityResultFailDto } from '../common/dtos/deleteEntityResultFail.dto'
import { DeleteEntityResultSuccessDto } from '../common/dtos/deleteEntityResultSuccess.dto'

import { UsersRoles } from './users.roles.entity'

@Injectable()
export default class UsersRolesService {
  constructor(
    @InjectRepository(UsersRoles)
    private readonly usersRolesRepository: EntityRepository<UsersRoles>,
    private readonly em: EntityManager
  ) {}

  async addUsersRoles(body: UserRoleCollection) {
    try {
      const data = body.map(({ userId: user, roleId: role }) =>
        this.usersRolesRepository.create({ user, role })
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

  async deleteUsersRoles(id: number) {
    const usersRoles = await this.em.findOne(UsersRoles, { id: id })
    if (usersRoles == null) {
      throw new HttpException(
        new DeleteEntityResultFailDto('Specified user-role does not exist!'),
        HttpStatus.BAD_REQUEST
      )
    }
    try {
      await this.em.nativeDelete(UsersRoles, { id: id })
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

import { HttpException, HttpStatus, Injectable } from '@nestjs/common'
import { InjectRepository } from '@mikro-orm/nestjs'
import { EntityRepository, wrap } from '@mikro-orm/core'
import { EntityManager } from '@mikro-orm/postgresql'
import generator from 'generate-password-ts'

import { encrypt } from '../auth/auth.helpers'

import { User } from './user.entity'

import { GetUsersDto } from './dtos/getUsers.dto'
import { PageDto } from '../common/dtos/page.dto'
import { UserWithGroupsAndRolesDto } from './dtos/userWithGroupsAndRoles.dto'
import { AddUserDto } from './dtos/addUser.dto'
import { UserDto } from './dtos/user.dto'
import { UsersRolesDto } from './dtos/usersRoles.dto'
import { GetUserRolesDto } from './dtos/getUserRoles.dto'
import { UsersRoles } from '../users-roles/users.roles.entity'
import { UsersGroups } from '../users-groups/users.groups.entity'
import { UsersGroupsDto } from './dtos/usersGroups.dto'
import { GetUserGroupsDto } from './dtos/getUserGroups.dto'
import { UpdateUserDto } from './dtos/updateUser.dto'
import { AddUserDataDto } from './dtos/addUserData.dto'
import { AddEntityResultDto } from '../common/dtos/addEntityResult.dto'
import { UpdateEntityResultDto } from '../common/dtos/updateEntityResult.dto'
import { ChangePasswordDataDto } from './dtos/changePasswordData.dto'

@Injectable()
export default class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: EntityRepository<User>,
    private readonly em: EntityManager
  ) {}

  async getUsers(
    limit = 50,
    offset = 0,
    isActive?: boolean,
    userIds?: number[],
    name?: string
  ) {
    const filters = {
      active: isActive !== undefined ? { active: isActive } : false,
      oneOf: userIds ? { ids: userIds } : false,
      name: name ? { name: name } : false
    }
    const [users, count] = await this.usersRepository.findAndCount(
      {},
      {
        filters,
        limit,
        offset,
        populate: ['usersGroups.group', 'usersRoles.role'],
        orderBy: { createdAt: 'desc' }
      }
    )
    const userDtos = users.map((user) => new UserWithGroupsAndRolesDto(user))
    return new GetUsersDto(userDtos, new PageDto(count, limit, offset))
  }

  async getUser(id: number) {
    const user = await this.usersRepository.findOneOrFail(id)

    return new UserDto(user)
  }

  async getUserFullByEmail(email: string) {
    const user = await this.usersRepository.findOneOrFail(
      {
        email
      },
      {
        populate: [
          'usersGroups.group',
          'usersRoles.role',
          'usersRoles.role.rolesPermissions',
          'usersRoles.role.rolesPermissions.permission'
        ]
      }
    )

    return {
      user,
      dto: new UserWithGroupsAndRolesDto(user)
    }
  }

  async getUserRoles(id: number, limit = 50, offset = 0) {
    const [usersRoles, count] = await this.em.findAndCount(
      UsersRoles,
      { user: id },
      { limit, offset, populate: ['role'], orderBy: { createdAt: 'desc' } }
    )
    const userRolesDtos = usersRoles.map(
      (usersRoles) => new UsersRolesDto(usersRoles)
    )
    return new GetUserRolesDto(userRolesDtos, new PageDto(count, limit, offset))
  }

  async getUserGroups(id: number, limit = 50, offset = 0) {
    const [usersGroups, count] = await this.em.findAndCount(
      UsersGroups,
      { user: id },
      { limit, offset, populate: ['group'], orderBy: { createdAt: 'desc' } }
    )
    const userGroupsDtos = usersGroups.map(
      (usersGroups) => new UsersGroupsDto(usersGroups)
    )
    return new GetUserGroupsDto(
      userGroupsDtos,
      new PageDto(count, limit, offset)
    )
  }

  generatePassword() {
    return generator.generate({
      length: 10,
      lowercase: true,
      uppercase: true,
      numbers: true,
      excludeSimilarCharacters: true,
      strict: true
    })
  }

  async addUser(body: AddUserDto) {
    try {
      const password = this.generatePassword()
      body.password = await encrypt(password)
      const user = this.usersRepository.create(body)
      await this.em.flush()
      return new AddEntityResultDto<AddUserDataDto>({
        data: { id: user.id, createdAt: user.createdAt, password: password }
      })
    } catch (e) {
      throw new HttpException(
        new AddEntityResultDto({
          errorMessage: 'Error description: ' + e.message
        }),
        HttpStatus.BAD_REQUEST
      )
    }
  }

  async updateUser(id: number, body: UpdateUserDto) {
    const user = await this.em.findOne(User, { id: id })
    if (user == null) {
      throw new HttpException(
        new UpdateEntityResultDto({
          errorMessage: 'Specified user does not exist!'
        }),
        HttpStatus.BAD_REQUEST
      )
    }
    try {
      wrap(user).assign(body)
      await this.em.flush()
      return new UpdateEntityResultDto({
        data: { updatedAt: user.updatedAt }
      })
    } catch (e) {
      throw new HttpException(
        new UpdateEntityResultDto({
          errorMessage: 'Error description: ' + e.message
        }),
        HttpStatus.BAD_REQUEST
      )
    }
  }

  async changePassword(id: number) {
    const user = await this.em.findOne(User, { id: id })
    if (user == null) {
      throw new HttpException(
        new UpdateEntityResultDto({
          errorMessage: 'Specified user does not exist!'
        }),
        HttpStatus.BAD_REQUEST
      )
    }
    try {
      const password = this.generatePassword()
      const hash = await encrypt(password)
      wrap(user).assign({ password: hash })
      await this.em.flush()
      return new UpdateEntityResultDto<ChangePasswordDataDto>({
        data: { password: password, updatedAt: user.updatedAt }
      })
    } catch (e) {
      throw new HttpException(
        new UpdateEntityResultDto({
          errorMessage: 'Error description: ' + e.message
        }),
        HttpStatus.BAD_REQUEST
      )
    }
  }
}

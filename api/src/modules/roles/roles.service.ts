import { HttpException, HttpStatus, Injectable } from '@nestjs/common'
import { InjectRepository } from '@mikro-orm/nestjs'
import { EntityRepository, wrap } from '@mikro-orm/core'
import { Role } from './role.entity'
import { EntityManager } from '@mikro-orm/postgresql'
import { PageDto } from '../common/dtos/page.dto'
import { RoleDto } from './dtos/role.dto'
import { GetRolesDto } from './dtos/getRoles.dto'
import { UsersRoles } from '../users-roles/users.roles.entity'
import { RoleUsersDto } from './dtos/roleUsers.dto'
import { GetRoleUsersDto } from './dtos/getRoleUsers.dto'
import { RoleItem } from './dtos/addRole.dto'
import { UpdateRoleDto } from './dtos/updateRole.dto'
import { AddEntityResultDto } from '../common/dtos/addEntityResult.dto'
import { UpdateEntityResultDto } from '../common/dtos/updateEntityResult.dto'
import { DeleteEntityResultFailDto } from '../common/dtos/deleteEntityResultFail.dto'
import { DeleteEntityResultSuccessDto } from '../common/dtos/deleteEntityResultSuccess.dto'

@Injectable()
export default class RolesService {
  constructor(
    @InjectRepository(Role)
    private readonly rolesRepository: EntityRepository<Role>,
    private readonly em: EntityManager
  ) {}

  async getRoles(limit = 50, offset = 0) {
    const [roles, count] = await this.rolesRepository.findAndCount(
      {},
      {
        limit,
        offset,
        populate: ['rolesPermissions.permission'],
        orderBy: { id: 'asc' }
      }
    )
    const roleDtos = roles.map((role) => new RoleDto(role))
    return new GetRolesDto(roleDtos, new PageDto(count, limit, offset))
  }

  async getRole(id: number) {
    try {
      const role = await this.rolesRepository.findOneOrFail(id, {
        populate: ['rolesPermissions.permission']
      })

      return new RoleDto(role)
    } catch ({ message }) {
      throw new HttpException({ message }, HttpStatus.BAD_REQUEST)
    }
  }

  async getRoleUsers(id: number, limit = 50, offset = 0) {
    const [usersRoles, count] = await this.em.findAndCount(
      UsersRoles,
      { role: { id: id } },
      { limit, offset, populate: ['user'], orderBy: { createdAt: 'desc' } }
    )
    const roleUsers = usersRoles.map((roleUsers) => new RoleUsersDto(roleUsers))
    return new GetRoleUsersDto(roleUsers, new PageDto(count, limit, offset))
  }

  async addRole(body: RoleItem) {
    try {
      const data = this.rolesRepository.create(body)

      await this.em.flush()

      return new AddEntityResultDto({ data: { id: data.id } }) // TODO: почему-то тут не получается засунуть весь объект data
    } catch ({ message }) {
      throw new HttpException({ message }, HttpStatus.BAD_REQUEST)
    }
  }

  async deleteRole(id: number) {
    const role = await this.em.findOne(Role, { id })

    if (!role) {
      throw new HttpException(
        new DeleteEntityResultFailDto('Specified role does not exist!'),
        HttpStatus.BAD_REQUEST
      )
    }

    try {
      this.em.remove(role)
      await this.em.flush()
      return new DeleteEntityResultSuccessDto()
    } catch (e) {
      throw new HttpException(
        new DeleteEntityResultFailDto('Error description: ' + e.message),
        HttpStatus.BAD_REQUEST
      )
    }
  }

  async updateRole(id: number, body: UpdateRoleDto) {
    const role = await this.em.findOne(Role, { id: id })
    if (role == null) {
      throw new HttpException(
        new UpdateEntityResultDto({
          errorMessage: 'Specified role does not exist!'
        }),
        HttpStatus.BAD_REQUEST
      )
    }
    try {
      wrap(role).assign(body)
      await this.em.flush()
      return new UpdateEntityResultDto({
        data: { updatedAt: role.updatedAt }
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

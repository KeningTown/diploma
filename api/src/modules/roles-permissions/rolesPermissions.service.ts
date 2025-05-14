import { HttpException, HttpStatus, Injectable } from '@nestjs/common'
import { InjectRepository } from '@mikro-orm/nestjs'
import { EntityRepository } from '@mikro-orm/core'
import { EntityManager } from '@mikro-orm/postgresql'
import { AddRolesPermissionsDto } from './dtos/addRolesPermissionsDto'
import { RolesPermissions } from './roles.permissions.entity'
import { AddEntityResultDto } from '../common/dtos/addEntityResult.dto'
import { DeleteEntityResultFailDto } from '../common/dtos/deleteEntityResultFail.dto'
import { DeleteEntityResultSuccessDto } from '../common/dtos/deleteEntityResultSuccess.dto'

@Injectable()
export default class RolesPermissionsService {
  constructor(
    @InjectRepository(RolesPermissions)
    private readonly rolesPermissionsRepository: EntityRepository<RolesPermissions>,
    private readonly em: EntityManager
  ) {}

  async addRolesPermissions(body: AddRolesPermissionsDto) {
    try {
      const rolesPermissions = this.rolesPermissionsRepository.create(body)
      await this.em.flush()
      return new AddEntityResultDto({
        data: { id: rolesPermissions.id, createdAt: rolesPermissions.createdAt }
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

  async deleteRolesPermissions(id: number) {
    const rolesPermissions = await this.em.findOne(RolesPermissions, {
      id: id
    })
    if (rolesPermissions == null) {
      throw new HttpException(
        new DeleteEntityResultFailDto(
          'Specified role-permission does not exist!'
        ),
        HttpStatus.BAD_REQUEST
      )
    }
    try {
      await this.em.nativeDelete(RolesPermissions, { id: id })
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

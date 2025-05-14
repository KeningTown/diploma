import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@mikro-orm/nestjs'
import { EntityRepository } from '@mikro-orm/core'

import { Permission } from './permission.entity'

import { PageDto } from '../common/dtos/page.dto'
import { PermissionDto } from './dtos/permission.dto'
import { GetPermissionsDto } from './dtos/getPermissions.dto'

@Injectable()
export default class PermissionsService {
  constructor(
    @InjectRepository(Permission)
    private readonly permissionsRepository: EntityRepository<Permission>
  ) {}

  async getPermissions(limit = 50, offset = 0) {
    const [permissions, count] = await this.permissionsRepository.findAndCount(
      {},
      { limit, offset, orderBy: { createdAt: 'desc' } }
    )
    const permissionsDtos = permissions.map((role) => new PermissionDto(role))
    return new GetPermissionsDto(
      permissionsDtos,
      new PageDto(count, limit, offset)
    )
  }
}

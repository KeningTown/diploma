import { Collection, Entity, Enum, OneToMany, Property } from '@mikro-orm/core'

import { RolesPermissions } from '../roles-permissions/roles.permissions.entity'
import { BaseEntity } from '../common/base.entity'

export enum RolesType {
  BASIC = 'basic',
  CUSTOM = 'custom'
}

@Entity({ tableName: 'roles' })
export class Role extends BaseEntity {
  @Property({ length: 50 })
  name: string

  @Enum({ items: () => RolesType })
  type: RolesType = RolesType.CUSTOM

  @OneToMany('RolesPermissions', 'role')
  rolesPermissions = new Collection<RolesPermissions>(this)
}

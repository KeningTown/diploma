import { Entity, ManyToOne } from '@mikro-orm/core'
import { Permission } from '../permissions/permission.entity'
import { Role } from '../roles/role.entity'
import { BaseEntity } from '../common/base.entity'

@Entity()
export class RolesPermissions extends BaseEntity {
  @ManyToOne({
    entity: () => Role,
    updateRule: 'cascade',
    deleteRule: 'cascade'
  })
  role!: Role

  @ManyToOne({
    entity: () => Permission,
    updateRule: 'cascade',
    deleteRule: 'cascade'
  })
  permission!: Permission
}

import { Entity, ManyToOne } from '@mikro-orm/core'

import { Role } from '../roles/role.entity'
import { User } from '../users/user.entity'
import { BaseEntity } from '../common/base.entity'

@Entity()
export class UsersRoles extends BaseEntity {
  @ManyToOne(() => Role, { deleteRule: 'cascade' })
  role: Role

  @ManyToOne(() => User, { deleteRule: 'cascade' })
  user: User
}

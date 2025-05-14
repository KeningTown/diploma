import { Entity, ManyToOne } from '@mikro-orm/core'
import { Group } from '../groups/group.entity'
import { User } from '../users/user.entity'
import { BaseEntity } from '../common/base.entity'

@Entity()
export class UsersGroups extends BaseEntity {
  @ManyToOne({
    entity: () => Group,
    updateRule: 'cascade',
    deleteRule: 'cascade'
  })
  group!: Group

  @ManyToOne({
    entity: () => User,
    updateRule: 'cascade',
    deleteRule: 'cascade'
  })
  user!: User
}

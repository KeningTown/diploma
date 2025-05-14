import {
  Collection,
  Entity,
  Filter,
  OneToMany,
  Opt,
  Property
} from '@mikro-orm/core'

import { UsersGroups } from '../users-groups/users.groups.entity'
import { UsersRoles } from '../users-roles/users.roles.entity'
import { BaseEntity } from '../common/base.entity'

@Entity({ tableName: 'users' })
@Filter({ name: 'active', cond: (args) => ({ active: args.active }) })
@Filter({ name: 'oneOf', cond: (args) => ({ id: { $in: args.ids } }) })
@Filter({
  name: 'name',
  cond: ({ name }) => ({
    $or: name.split(' ').flatMap((name: string) => {
      return ['firstName', 'middleName', 'lastName'].map((key) => ({
        [key]: new RegExp(`.*${name}.*`, 'i')
      }))
    })
  })
})
export class User extends BaseEntity {
  @Property({ length: 255 })
  firstName: string

  @Property({ length: 255 })
  lastName: string

  @Property({ length: 255 })
  middleName: string

  @Property({ length: 255 })
  email: string

  @Property({ length: 100 })
  password: string

  @Property({ type: 'boolean' })
  active: boolean & Opt = true

  @OneToMany('UsersGroups', 'user')
  usersGroups = new Collection<UsersGroups>(this)

  @OneToMany('UsersRoles', 'user')
  usersRoles = new Collection<UsersRoles>(this)

  @Property({ nullable: true })
  deletedBy?: number

  @Property({ nullable: true })
  deletedAt?: Date

  @Property({ nullable: true })
  refreshToken?: string
}

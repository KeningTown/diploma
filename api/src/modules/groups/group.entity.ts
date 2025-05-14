import { Entity, Property } from '@mikro-orm/core'
import { BaseEntity } from '../common/base.entity'

@Entity({ tableName: 'groups' })
export class Group extends BaseEntity {
  @Property({ length: 255 })
  name!: string
}

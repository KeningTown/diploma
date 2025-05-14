import { PrimaryKey, Property } from '@mikro-orm/core'

export abstract class BaseEntity {
  @PrimaryKey()
  id!: number

  @Property()
  createdBy = 1

  @Property({ nullable: true })
  updatedBy?: number

  @Property()
  createdAt = new Date()

  @Property({ onUpdate: () => new Date() })
  updatedAt = new Date()
}

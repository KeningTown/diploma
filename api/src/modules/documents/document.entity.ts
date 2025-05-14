import { Collection, Entity, OneToMany, Property } from '@mikro-orm/core'
import { BaseEntity } from '../common/base.entity'
import { Block } from '../blocks/block.entity'

@Entity({ tableName: 'documents' })
export class Document extends BaseEntity {
  @Property({ length: 255 })
  title!: string

  @Property({ type: 'text' })
  abstract!: string

  @OneToMany('Block', 'document')
  blocks = new Collection<Block>(this)

  @Property({ nullable: true })
  deletedBy?: number

  @Property({ nullable: true })
  deletedAt?: Date
}

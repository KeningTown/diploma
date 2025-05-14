import { Entity, Enum } from '@mikro-orm/core'

import { BaseEntity } from '../common/base.entity'

export enum PermissionEntity {
  USER = 'USER',
  ROLE = 'ROLE',
  GROUP = 'GROUP',
  DOCUMENT = 'DOCUMENT',
  BLOCK = 'BLOCK',
  PARAGRAPH = 'PARAGRAPH',
  ATTACHMENT = 'ATTACHMENT',
  TERM = 'TERM',
  TERM_RELATION = 'TERM_RELATION',
  TERM_ANALYSIS = 'TERM_ANALYSIS',
  RECORD = 'RECORD',

  USER_ROLE = 'USER_ROLE',
  USER_GROUP = 'USER_GROUP',
  ROLE_PERMISSION = 'ROLE_PERMISSION',
  DOCUMENT_GROUP = 'DOCUMENT_GROUP'
}

export enum PermissionAction {
  CREATE = 'CREATE',
  READ = 'READ',
  UPDATE = 'UPDATE',
  DELETE = 'DELETE',
  LIST = 'LIST'
}

@Entity({ tableName: 'permissions' })
export class Permission extends BaseEntity {
  @Enum({ items: () => PermissionEntity })
  entity: PermissionEntity

  @Enum({ items: () => PermissionAction })
  action: PermissionAction
}

import { PermissionEntity, PermissionAction } from './permission.entity'

export const ADMIN_ROLE_NAME = 'Администратор'

export const DEFAULT_ROLES = [
  {
    name: ADMIN_ROLE_NAME,
    permissions: Object.fromEntries(
      Object.values(PermissionEntity).map((entity) => [
        entity,
        Object.values(PermissionAction)
      ])
    )
  },
  {
    name: 'Менеджер по персоналу',
    permissions: Object.fromEntries(
      [
        PermissionEntity.USER,
        PermissionEntity.ROLE,
        PermissionEntity.GROUP,
        PermissionEntity.USER_ROLE,
        PermissionEntity.USER_GROUP,
        PermissionEntity.ROLE_PERMISSION
      ].map((entity) => [entity, Object.values(PermissionAction)])
    )
  },
  {
    name: 'Менеджер по контенту',
    permissions: Object.fromEntries(
      [
        PermissionEntity.DOCUMENT,
        PermissionEntity.BLOCK,
        PermissionEntity.PARAGRAPH,
        PermissionEntity.ATTACHMENT,
        PermissionEntity.DOCUMENT_GROUP
      ].map((entity) => [entity, Object.values(PermissionAction)])
    )
  },
  {
    name: 'Эксперт',
    permissions: Object.fromEntries(
      [
        PermissionEntity.TERM,
        PermissionEntity.TERM_RELATION,
        PermissionEntity.TERM_ANALYSIS
      ].map((entity) => [entity, Object.values(PermissionAction)])
    )
  },
  {
    name: 'Экзаменатор',
    permissions: Object.fromEntries(
      [PermissionEntity.RECORD].map((entity) => [
        entity,
        Object.values(PermissionAction)
      ])
    )
  }
]

import { Color } from '@/ui/theme'

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
  LIST = 'LIST',
  UPDATE = 'UPDATE',
  DELETE = 'DELETE'
}

export const PERMISSION_ENTITY_RU = {
  [PermissionEntity.USER]: 'Пользователь',
  [PermissionEntity.ROLE]: 'Роль',
  [PermissionEntity.GROUP]: 'Группа',
  [PermissionEntity.DOCUMENT]: 'Документ',
  [PermissionEntity.BLOCK]: 'Блок',
  [PermissionEntity.PARAGRAPH]: 'Абзац',
  [PermissionEntity.ATTACHMENT]: 'Вложение',
  [PermissionEntity.TERM]: 'Термин',
  [PermissionEntity.TERM_RELATION]: 'Связь между терминами',
  [PermissionEntity.TERM_ANALYSIS]: 'Терминологический анализ',
  [PermissionEntity.RECORD]: 'Мониторинг',
  [PermissionEntity.USER_ROLE]: 'Роль пользователя',
  [PermissionEntity.USER_GROUP]: 'Группа пользователя',
  [PermissionEntity.ROLE_PERMISSION]: 'Разрешение роли',
  [PermissionEntity.DOCUMENT_GROUP]: 'Группа документа'
} as const

export const PERMISSION_ACTION_RU = {
  [PermissionAction.CREATE]: 'Создание',
  [PermissionAction.READ]: 'Чтение',
  [PermissionAction.UPDATE]: 'Изменение',
  [PermissionAction.DELETE]: 'Удаление',
  [PermissionAction.LIST]: 'Список'
} as const

export const PERMISSION_ACTION_COLOR: Record<string, Color> = {
  [PermissionAction.CREATE]: 'green',
  [PermissionAction.READ]: 'blue',
  [PermissionAction.UPDATE]: 'orange',
  [PermissionAction.DELETE]: 'red',
  [PermissionAction.LIST]: 'geekblue'
}

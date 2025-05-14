export enum RoleType {
  BASIC = 'basic',
  CUSTOM = 'custom'
}

export const ROLE_TYPE_RU = {
  [RoleType.BASIC]: 'Базовая',
  [RoleType.CUSTOM]: 'Пользовательская'
}

export const ROLE_FILED_RU = {
  id: 'ID',
  name: 'Название',
  type: 'Тип',
  permissions: 'Разрешения'
}

export const ROLE_FIELD_PLACEHOLDER = {
  name: 'Менеджер'
}

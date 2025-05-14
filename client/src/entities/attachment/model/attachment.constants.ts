export enum AttachmentType {
  IMAGE = 'image',
  FILE = 'file'
}

export const FIELD_RU = {
  title: 'Заголовок',
  description: 'Описание',
  file: 'Файл',
  type: 'Тип',
  order: 'Порядок'
} as const

export const FIELD_PLACEHOLDER = {
  title: 'Как правильно надевать защитный костюм',
  description: 'Элементы костюма надеваются в строго установленном порядке...'
} as const

export const TYPE_RU = {
  [AttachmentType.IMAGE]: 'Изображение',
  [AttachmentType.FILE]: 'Файл'
}

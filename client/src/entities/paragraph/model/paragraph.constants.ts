export enum ParagraphType {
  BASIC = 'basic',
  ADDITIONAL = 'additional',
  REVEALING = 'revealing',
  DEFINITION = 'definition'
}

export const FIELD_RU = {
  text: 'Содержание',
  type: 'Тип',
  width: 'Размер',
  order: 'Порядок',
  attachments: 'Вложения'
}

export const FIELD_PLACEHOLDER = {
  text: 'Техническое обслуживание и ремонт состоят из следующих этапов...'
}

export const TYPE_RU = {
  [ParagraphType.BASIC]: 'Основной',
  [ParagraphType.ADDITIONAL]: 'Дополнительный',
  [ParagraphType.REVEALING]: 'Расскрывающий'
}

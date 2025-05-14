import { FormRule } from 'antd'

export const REQUIRED_MESSAGE = {
  DEFAULT: 'Введите значение',
  LAST_NAME: 'Введите фамилию',
  FIRST_NAME: 'Введите имя',
  EMAIL: 'Введите электронную почту',
  NAME: 'Введите название',
  FILE: 'Загрузите файл',
  TITLE: 'Введите заголовок',
  DESCRIPTION: 'Введите описание',
  ORDER: 'Введите порядок'
}

export const required = (message = REQUIRED_MESSAGE.DEFAULT): FormRule => ({
  required: true,
  message
})

export const email: FormRule = {
  type: 'email',
  message: 'Неверный формат электронной почты'
}

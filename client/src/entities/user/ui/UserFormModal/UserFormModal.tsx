import React, { useMemo, useCallback } from 'react'
import { Form, Input, Checkbox, Typography } from 'antd'

import { UserProps, user } from '../../model'

import { getInitialValues } from './UserFormModal.helpers'

import { validation } from '@/services'

import { useRequest, useNotification } from '@/hooks'

import { ModalProps, FormContent } from '@/ui'
import { ModalForm, Value } from '@/components'

type Props = ModalProps & {
  item?: UserProps.Item
  onSuccess: () => void
}

const UserFormModal: React.FC<Props> = ({ item, onSuccess, ...modalProps }) => {
  const notify = useNotification()

  const { request: create, ...createState } = useRequest(user.api.create)
  const { request: update, ...updateState } = useRequest(user.api.update)

  const initialValues = useMemo(() => getInitialValues(item), [item])

  const handleSubmit = useCallback(
    (formData: UserProps.CreateData) => {
      if (item) {
        return update<UserProps.CreateError>(item.id, formData).then(
          ({ error }) => {
            if (error) {
              return notify(
                'error',
                'Не удалось обновить данные пользователя',
                <Typography.Paragraph>
                  <pre>{error.response?.data.message}</pre>
                </Typography.Paragraph>
              )
            }

            notify('success', 'Данные пользователя обновлены')
            onSuccess()
          }
        )
      }

      create<UserProps.CreateError>(formData).then(({ data, error }) => {
        if (error) {
          return notify(
            'error',
            'Не удалось создать пользователя',
            <Typography.Paragraph>
              <pre>{error.response?.data.message}</pre>
            </Typography.Paragraph>
          )
        }

        const name = user.service.getShortName(formData as UserProps.Item)

        notify(
          'success',
          <>
            Пользователь{' '}
            <Value inline bold>
              {name}
            </Value>{' '}
            создан
          </>,
          <>
            Пароль{' '}
            <Value inline bold copy>
              {data.data.password}
            </Value>
          </>
        )
        onSuccess()
      })
    },
    [create, item, notify, onSuccess, update]
  )

  return (
    <ModalForm
      {...modalProps}
      {...(item ? updateState : createState)}
      okText={item ? 'Сохранить' : 'Создать'}
      title={item ? 'Редактирование пользователя' : 'Создание пользователя'}
      initialValues={initialValues}
      onSubmit={handleSubmit}
    >
      <FormContent layout={[8, 8, 8, 16, 8]}>
        <Form.Item
          required
          name="lastName"
          label={user.constants.USER_FIELD_RU.lastName}
          rules={[validation.required(validation.REQUIRED_MESSAGE.LAST_NAME)]}
        >
          <Input placeholder={user.constants.USER_FIELD_PLACEHOLDER.lastName} />
        </Form.Item>
        <Form.Item
          required
          name="firstName"
          label={user.constants.USER_FIELD_RU.firstName}
          rules={[validation.required(validation.REQUIRED_MESSAGE.FIRST_NAME)]}
        >
          <Input
            placeholder={user.constants.USER_FIELD_PLACEHOLDER.firstName}
          />
        </Form.Item>
        <Form.Item
          name="middleName"
          label={user.constants.USER_FIELD_RU.middleName}
        >
          <Input
            placeholder={user.constants.USER_FIELD_PLACEHOLDER.middleName}
          />
        </Form.Item>
        <Form.Item
          required
          name="email"
          label={user.constants.USER_FIELD_RU.email}
          rules={[
            validation.required(validation.REQUIRED_MESSAGE.EMAIL),
            validation.email
          ]}
        >
          <Input placeholder={user.constants.USER_FIELD_PLACEHOLDER.email} />
        </Form.Item>
        <Form.Item
          name="active"
          valuePropName="checked"
          label={user.constants.USER_FIELD_RU.active}
        >
          <Checkbox />
        </Form.Item>
      </FormContent>
    </ModalForm>
  )
}

export default UserFormModal

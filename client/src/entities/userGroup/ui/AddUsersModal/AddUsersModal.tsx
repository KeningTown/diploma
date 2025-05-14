import React, { useCallback } from 'react'
import { Form } from 'antd'

import { userGroup } from '../../model'
import { user, UserProps } from '../../../user'

import { getApiArgs, usersToOptions, renderUser } from './AddUsersModal.helpers'

import { useNotification, useRequest } from '@/hooks'

import { ModalProps, SearchMultiple } from '@/ui'
import { ModalForm, Value } from '@/components'

type FormData = {
  users: {
    value: number
    label: React.ReactNode
  }[]
}

type Props = ModalProps & {
  groupId: number
  excluded?: number[]
  onSuccess: () => void
}

const AddUsersModal: React.FC<Props> = ({
  groupId,
  excluded,
  onSuccess,
  ...modalProps
}) => {
  const notify = useNotification()

  const { request, ...requestState } = useRequest(userGroup.api.create)

  const handleSubmit = useCallback(
    (formData: FormData) => {
      const data = formData.users.map(({ value: userId }) => ({
        groupId,
        userId
      }))

      request(data).then(({ error }) => {
        if (error) {
          return notify('error', 'Не удалось добавить пользователей')
        }

        const users = formData.users.map(({ label }) => label)

        notify(
          'success',
          <>
            Для группы{' '}
            {data.length === 1
              ? 'добавлен пользователь'
              : 'добавлены пользователи'}{' '}
            <Value inline bold>
              {users}
            </Value>
          </>
        )
        onSuccess()
      })
    },
    [notify, onSuccess, request, groupId]
  )

  return (
    <ModalForm
      {...modalProps}
      {...requestState}
      title="Добавление пользователей"
      okText="Добавить"
      onSubmit={handleSubmit}
    >
      <Form.Item name="users" label="Пользователи">
        <SearchMultiple<UserProps.List>
          excluded={excluded}
          api={user.api.list}
          getApiArgs={getApiArgs}
          dataToOptions={usersToOptions}
          optionRender={renderUser}
        />
      </Form.Item>
    </ModalForm>
  )
}

export default AddUsersModal

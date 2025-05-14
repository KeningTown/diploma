import React, { useCallback } from 'react'
import { Form } from 'antd'

import { userRole } from '../../model'
import { role, RoleProps } from '../../../role/model'
import { user } from '../../../user'

import { dataDecorator, rolesMapper } from './AddRolesModal.helpers'

import { useRequest, useNotification } from '@/hooks'

import { ModalProps, SelectMultiple } from '@/ui'
import { ModalForm, Value } from '@/components'

type FormData = { roles: RoleProps.Item[] }

type Props = ModalProps & {
  userId: number
  excluded?: number[]
  onSuccess: () => void
}

const AddRolesModal: React.FC<Props> = ({
  userId,
  excluded,
  onSuccess,
  ...modalProps
}) => {
  const notify = useNotification()

  const { request, ...requestState } = useRequest(userRole.api.create)

  const handleSubmit = useCallback(
    (formData: FormData) => {
      const data = formData.roles.map(({ id: roleId }) => ({
        roleId,
        userId
      }))

      request(data).then(({ error }) => {
        if (error) {
          return notify('error', 'Не удалось назначить роли')
        }

        notify(
          'success',
          <>
            Пользователю{' '}
            {data.length === 1 ? 'назначена роль' : 'назначены роли'}{' '}
            <Value inline bold>
              {formData.roles.map(({ name }) => name)}
            </Value>
          </>
        )
        onSuccess()
      })
    },
    [notify, onSuccess, request, userId]
  )

  return (
    <ModalForm
      {...modalProps}
      {...requestState}
      title="Назначение ролей пользователю"
      okText="Назначить"
      onSubmit={handleSubmit}
    >
      <Form.Item name="roles" label={user.constants.USER_FIELD_RU.roles}>
        <SelectMultiple<RoleProps.Item>
          excluded={excluded}
          request={role.api.list}
          dataDecorator={dataDecorator}
          optionsMapper={rolesMapper}
        />
      </Form.Item>
    </ModalForm>
  )
}

export default AddRolesModal

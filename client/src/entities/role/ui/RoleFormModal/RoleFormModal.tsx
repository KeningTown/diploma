import React, { useMemo } from 'react'
import { Form, Input } from 'antd'

import { RoleProps, role } from '../../model'
// import { Permission } from '../../../permission'

import { getInitialValues } from './RoleFormModal.helpers'

import { validation } from '@/services'

import { useRequest, useNotification } from '@/hooks'

import { ModalProps, FormContent } from '@/ui'
import { ModalForm, Value } from '@/components'

type Props = ModalProps & {
  item?: RoleProps.Item
  onSuccess: () => void
}

const RoleFormModal: React.FC<Props> = ({ item, onSuccess, ...modalProps }) => {
  const notify = useNotification()

  const { request: create, ...createState } = useRequest(role.api.create)
  const { request: update, ...updateState } = useRequest(role.api.update)

  const initialValues = useMemo(() => getInitialValues(item), [item])

  // const handleChangePermissions = (value: number[]) => {
  //   form.setFieldValue('permissions', value)
  // }

  const handleSubmit = (formData: RoleProps.CreateData) => {
    if (item) {
      return update(item.id, formData).then(({ error }) => {
        if (error) {
          return notify('error', 'Не удалось обновить роль')
        }

        notify('success', 'Роль обновлена')
        onSuccess()
      })
    }

    create(formData).then(({ error }) => {
      const name = (
        <Value inline bold>
          {formData.name}
        </Value>
      )

      if (error) {
        return notify('error', <>Не удалось создать роль {name}</>)
      }

      notify('success', <>Роль {name} создана</>)
      onSuccess()
    })
  }

  return (
    <ModalForm
      {...modalProps}
      {...(item ? updateState : createState)}
      okText={item ? 'Сохранить' : 'Создать'}
      title={item ? 'Редактирование роли' : 'Создание роли'}
      initialValues={initialValues}
      onSubmit={handleSubmit}
    >
      <FormContent>
        <Form.Item hidden required name="type" />
        <Form.Item
          required
          name="name"
          label={role.constants.ROLE_FILED_RU.name}
          rules={[validation.required(validation.REQUIRED_MESSAGE.NAME)]}
        >
          <Input placeholder={role.constants.ROLE_FIELD_PLACEHOLDER.name} />
        </Form.Item>
        {/* <Form.Item
            name="permissions"
            label={role.constants.ROLE_FILED_RU.permissions}
          >
            <Permission.PermissionTree
              initial={initialValues.permissions}
              onChange={handleChangePermissions}
            />
          </Form.Item> */}
      </FormContent>
    </ModalForm>
  )
}

export default RoleFormModal

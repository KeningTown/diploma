import React, { useMemo } from 'react'
import { Form, Input } from 'antd'

import { GroupProps, group } from '../../model'

import { getInitialValues } from './GroupFormModal.helpers'

import { validation } from '@/services'

import { useRequest, useNotification } from '@/hooks'

import { ModalProps, FormContent } from '@/ui'
import { ModalForm, Value } from '@/components'

type Props = ModalProps & {
  item?: GroupProps.Item
  onSuccess: () => void
}

const GroupFormModal: React.FC<Props> = ({
  item,
  onSuccess,
  ...modalProps
}) => {
  const notify = useNotification()

  const { request: create, ...createState } = useRequest(group.api.create)
  const { request: update, ...updateState } = useRequest(group.api.update)

  const initialValues = useMemo(() => getInitialValues(item), [item])

  const handleSubmit = (formData: GroupProps.CreateData) => {
    if (item) {
      return update(item.id, formData).then(({ error }) => {
        if (error) {
          return notify('error', 'Не удалось обновить группу')
        }

        notify('success', 'Группа обновлена')
        onSuccess()
      })
    }

    create(formData).then(({ error }) => {
      if (error) {
        return notify('error', 'Не удалось создать группу')
      }

      notify(
        'success',
        <>
          Группа{' '}
          <Value inline bold>
            {formData.name}
          </Value>{' '}
          создана
        </>
      )
      onSuccess()
    })
  }

  return (
    <ModalForm
      {...modalProps}
      {...(item ? updateState : createState)}
      okText={item ? 'Сохранить' : 'Создать'}
      title={item ? 'Редактирование группы' : 'Создание группы'}
      initialValues={initialValues}
      onSubmit={handleSubmit}
    >
      <FormContent>
        <Form.Item hidden required name="type" />
        <Form.Item
          required
          name="name"
          label={group.constants.GROUP_FILED_RU.name}
          rules={[validation.required(validation.REQUIRED_MESSAGE.NAME)]}
        >
          <Input placeholder={group.constants.GROUP_FIELD_PLACEHOLDER.name} />
        </Form.Item>
      </FormContent>
    </ModalForm>
  )
}

export default GroupFormModal

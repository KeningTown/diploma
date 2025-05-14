import React, { useCallback } from 'react'
import { Form } from 'antd'

import { group, GroupProps } from '../../../group/model'
import { user } from '../../../user'
import { userGroup } from '../../model'

import { dataDecorator, groupsMapper } from './AddGroupsModal.helpers'

import { useNotification, useRequest } from '@/hooks'

import { ModalProps, SelectMultiple } from '@/ui'
import { ModalForm, Value } from '@/components'

type FormData = { groups: GroupProps.Item[] }

type Props = ModalProps & {
  userId: number
  excluded?: number[]
  onSuccess: () => void
}

const AddGroupsModal: React.FC<Props> = ({
  userId,
  excluded,
  onSuccess,
  ...modalProps
}) => {
  const notify = useNotification()

  const { request, ...requestState } = useRequest(userGroup.api.create)

  const handleSubmit = useCallback(
    (formData: FormData) => {
      const data = formData.groups.map(({ id: groupId }) => ({
        groupId,
        userId
      }))

      request(data).then(({ error }) => {
        if (error) {
          return notify('error', 'Не удалось назначить группы')
        }

        notify(
          'success',
          <>
            Пользователю{' '}
            {data.length === 1 ? 'назначена группа' : 'назначены группы'}{' '}
            <Value inline bold>
              {formData.groups.map(({ name }) => name)}
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
      title="Назначение групп пользователю"
      okText="Назначить"
      onSubmit={handleSubmit}
    >
      <Form.Item name="groups" label={user.constants.USER_FIELD_RU.groups}>
        <SelectMultiple<GroupProps.Item>
          excluded={excluded}
          request={group.api.list}
          dataDecorator={dataDecorator}
          optionsMapper={groupsMapper}
        />
      </Form.Item>
    </ModalForm>
  )
}

export default AddGroupsModal

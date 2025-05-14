import React, { useCallback } from 'react'
import { Form } from 'antd'

import { group, GroupProps } from '../../../group'
import { document } from '../../../document'
import { documentGroup } from '../../model'

import { dataDecorator, groupsMapper } from './AddGroupsModal.helpers'

import { useNotification, useRequest } from '@/hooks'

import { ModalProps, SelectMultiple } from '@/ui'
import { ModalForm, Value } from '@/components'

type FormData = { groups: GroupProps.Item[] }

type Props = ModalProps & {
  documentId: number
  excluded?: number[]
  onSuccess: () => void
}

const AddGroupsModal: React.FC<Props> = ({
  documentId,
  excluded,
  onSuccess,
  ...modalProps
}) => {
  const notify = useNotification()

  const { request, ...requestState } = useRequest(documentGroup.api.create)

  const handleSubmit = useCallback(
    (formData: FormData) => {
      const data = formData.groups.map(({ id: groupId }) => ({
        groupId,
        documentId
      }))

      request(data).then(({ error }) => {
        if (error) {
          return notify('error', 'Не удалось назначить группы')
        }

        notify(
          'success',
          <>
            Для документа{' '}
            {data.length === 1 ? 'назначена группа' : 'назначены группы'}{' '}
            <Value inline bold>
              {formData.groups.map(({ name }) => name)}
            </Value>
          </>
        )
        onSuccess()
      })
    },
    [notify, onSuccess, request, documentId]
  )

  return (
    <ModalForm
      {...modalProps}
      {...requestState}
      title="Назначение групп для документа"
      okText="Назначить"
      onSubmit={handleSubmit}
    >
      <Form.Item
        name="groups"
        label={document.constants.DOCUMENT_FIELD_RU.groups}
      >
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

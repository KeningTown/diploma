import React, { useMemo, useCallback } from 'react'
import { Form, Input } from 'antd'

import { DocumentProps, document } from '../../model'

import { getInitialValues } from './DocumentFormModal.helpers'

import { useRequest, useNotification } from '@/hooks'

import { ModalProps, FormContent } from '@/ui'
import { ModalForm } from '@/components'

type Props = ModalProps & {
  item?: DocumentProps.Item
  onSuccess: () => void
}

const DocumentFormModal: React.FC<Props> = ({
  item,
  onSuccess,
  ...modalProps
}) => {
  const notify = useNotification()

  const { request: create, ...createState } = useRequest(document.api.create)
  const { request: update, ...updateState } = useRequest(document.api.update)

  const initialValues = useMemo(() => getInitialValues(item), [item])

  const handleSubmit = useCallback(
    (formData: DocumentProps.CreateData) => {
      if (item) {
        return update(item.id, formData).then(({ error }) => {
          if (error) {
            return notify('error', 'Не удалось обновить документ')
          }

          notify('success', 'Документ обновлен')
          onSuccess()
        })
      }

      create(formData).then(({ error }) => {
        if (error) {
          return notify('error', 'Не удалось создать документ')
        }

        notify('success', 'Документ создан')
        onSuccess()
      })
    },
    [create, update, item, notify, onSuccess]
  )

  return (
    <ModalForm
      {...modalProps}
      {...(item ? updateState : createState)}
      okText={item ? 'Обновить' : 'Создать'}
      title={item ? 'Редактирование документа' : 'Создание документа'}
      initialValues={initialValues}
      onSubmit={handleSubmit}
    >
      <FormContent>
        <Form.Item
          required
          name="title"
          label={document.constants.DOCUMENT_FIELD_RU.title}
        >
          <Input.TextArea
            autoSize
            placeholder={document.constants.DOCUMENT_FIELD_PLACEHOLDER.title}
          />
        </Form.Item>
        <Form.Item
          required
          name="abstract"
          label={document.constants.DOCUMENT_FIELD_RU.abstract}
        >
          <Input.TextArea
            autoSize
            placeholder={document.constants.DOCUMENT_FIELD_PLACEHOLDER.abstract}
          />
        </Form.Item>
      </FormContent>
    </ModalForm>
  )
}

export default DocumentFormModal

import React, { useMemo, useCallback } from 'react'
import { Form, Input } from 'antd'

import { TermProps, term } from '../../model'

import { getInitialValues } from './TermFormModal.constants'

import { useRequest, useNotification } from '@/hooks'

import { ModalProps, FormContent } from '@/ui'
import { ModalForm } from '@/components'

type Props = ModalProps & {
  fromAnalysis?: boolean
  item?: TermProps.Item
  onSuccess: () => void
}

const TermFormModal: React.FC<Props> = ({
  fromAnalysis,
  item,
  onSuccess,
  ...modalProps
}) => {
  const notify = useNotification()

  const { request: create, ...createState } = useRequest(term.api.create)
  const { request: update, ...updateState } = useRequest(term.api.update)

  const title = useMemo(() => {
    if (item) {
      if (fromAnalysis) {
        return 'Добавление термина'
      }

      return 'Редактирование термина'
    }

    return 'Создание термина'
  }, [fromAnalysis, item])

  const okText = useMemo(() => {
    if (item) {
      if (fromAnalysis) {
        return 'Добавить'
      }

      return 'Обновить'
    }

    return 'Создать'
  }, [fromAnalysis, item])

  const initialValues = useMemo(() => getInitialValues(item), [item])

  const handleSubmit = useCallback(
    (formData: TermProps.CreateData) => {
      if (item) {
        const data = fromAnalysis ? { ...formData, isActive: true } : formData

        return update(item.id, data).then(({ error }) => {
          if (error) {
            const message = fromAnalysis
              ? 'Не удалось добавить термин'
              : 'Не удалось обновить термин'

            return notify('error', message)
          }

          const message = fromAnalysis ? 'Термин добавлен' : 'Термин обновлен'

          notify('success', message)
          onSuccess()
        })
      }

      create(formData).then(({ error }) => {
        if (error) {
          return notify('error', 'Не удалось создать термин')
        }

        notify('success', 'Термин создан')
        onSuccess()
      })
    },
    [item, create, update, fromAnalysis, notify, onSuccess]
  )

  return (
    <ModalForm
      {...modalProps}
      {...(item ? updateState : createState)}
      title={title}
      okText={okText}
      initialValues={initialValues}
      onSubmit={handleSubmit}
    >
      <FormContent>
        <Form.Item
          required
          name="term"
          label={term.constants.FIELD_RU.term}
          tooltip="Слово или словосочетание в начальной форме (именительный падеж, единственное число), например, «информация», «информационная система»"
        >
          <Input placeholder={term.constants.FIELD_PLACEHOLDER.term} />
        </Form.Item>
        <Form.Item name="definition" label={term.constants.FIELD_RU.definition}>
          <Input.TextArea
            autoSize
            placeholder={term.constants.FIELD_PLACEHOLDER.definition}
          />
        </Form.Item>
      </FormContent>
    </ModalForm>
  )
}

export default TermFormModal

import React, { useCallback } from 'react'
import { Form } from 'antd'

import { term, TermProps } from '../../../term'
import { termRelation, TermRelationProps } from '../../model'

import {
  MODAL_TITLE,
  dataDecorator,
  optionsMapper
} from './AddRelationsModal.constants'

import { useNotification, useRequest } from '@/hooks'

import { ModalProps, SelectMultiple } from '@/ui'
import { ModalForm, Value } from '@/components'

type FormData = { terms: TermProps.Item[] }

type Props = ModalProps & {
  termId: number
  relationType: TermRelationProps.Type
  excluded?: number[]
  onSuccess: () => void
}

const AddRelationsModal: React.FC<Props> = ({
  termId,
  relationType,
  excluded,
  onSuccess,
  ...modalProps
}) => {
  const notify = useNotification()

  const { request, ...requestState } = useRequest(termRelation.api.create)

  const handleSubmit = useCallback(
    (formData: FormData) => {
      const data = formData.terms.map((term) => ({
        termId,
        relation: {
          type: relationType,
          termId: term.id
        }
      }))

      request(data).then(({ error }) => {
        if (error) {
          return notify('error', 'Не удалось добавить термины')
        }

        notify(
          'success',
          <>
            Для термина{' '}
            {data.length === 1 ? 'добавлен термин' : 'добавлены термины'}{' '}
            <Value inline bold>
              {formData.terms.map(({ term }) => term)}
            </Value>
          </>
        )
        onSuccess()
      })
    },
    [notify, onSuccess, relationType, request, termId]
  )

  return (
    <ModalForm
      {...modalProps}
      {...requestState}
      title={`Добавление ${MODAL_TITLE[relationType]}`}
      okText="Добавить"
      onSubmit={handleSubmit}
    >
      <Form.Item name="terms" label={term.constants.FIELD_RU.relations}>
        <SelectMultiple<TermProps.ItemFull>
          excluded={excluded}
          request={() => term.api.list({ limit: 1000 })}
          dataDecorator={dataDecorator}
          optionsMapper={optionsMapper}
        />
      </Form.Item>
    </ModalForm>
  )
}

export default AddRelationsModal

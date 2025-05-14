import React, { useMemo, useCallback, useEffect } from 'react'
import { Form, Input, Select, InputNumber } from 'antd'

import { block, BlockProps } from '../../model'

import { getInitialValues } from './BlockForm.constants'

import { useNotification, useRequest } from '@/hooks'

import { Size } from '@/ui/theme'
import { Button, FormContent, Card } from '@/ui'

import * as Styled from './BlockForm.styled'

type Props = {
  documentId: number
  item: BlockProps.Item | null
  order: number
  onSuccess: (block: BlockProps.Item) => void
  onClose: () => void
}

const BlockForm: React.FC<Props> = ({
  documentId,
  item,
  order,
  onSuccess,
  onClose
}) => {
  const notify = useNotification()

  const { request: create, isLoading: isCreating } = useRequest(
    block.api.create
  )
  const { request: update, isLoading: isUpdating } = useRequest(
    block.api.update
  )

  const [form] = Form.useForm()

  const initialValues = useMemo(
    () => getInitialValues(order, item),
    [item, order]
  )

  useEffect(() => {
    form.setFieldsValue(initialValues)
  }, [form, initialValues])

  const handleSubmit = useCallback(
    (formData: BlockProps.CreateData) => {
      if (item) {
        return update(item.id, formData).then(({ error }) => {
          if (error) {
            return notify('error', 'Не удалось обновить блок')
          }

          onSuccess({ ...item, ...formData })
          notify('success', 'Блок обновлен')
        })
      }

      create(documentId, formData).then(({ data }) => {
        if (!data) {
          return notify('error', 'Не удалось создать блок')
        }

        onSuccess({
          ...formData,
          id: data.data.id,
          paragraphs: []
        })
        notify('success', 'Блок создан')
      })
    },
    [documentId, item, notify, onSuccess, create, update]
  )

  return (
    <Styled.Container
      as={Card}
      title={item ? 'Редактирование блока' : 'Создание блока'}
      extra={<Button icon="close" size="small" type="text" onClick={onClose} />}
    >
      <Form
        layout="vertical"
        form={form}
        initialValues={initialValues}
        onFinish={handleSubmit}
      >
        <FormContent noVerticalSpace layout={[24, 12, 12]}>
          <Form.Item
            required
            name="title"
            label={block.constants.BLOCK_FIELD_RU.title}
          >
            <Input.TextArea
              autoSize
              placeholder={block.constants.BLOCK_FIELD_PLACEHOLDER.title}
            />
          </Form.Item>
          <Form.Item
            required
            name="width"
            label={block.constants.BLOCK_FIELD_RU.width}
          >
            <Select>
              {Object.entries(Size).map(([key, value]) => (
                <Select.Option key={key} value={value}>
                  {key}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item
            required
            name="order"
            label={block.constants.BLOCK_FIELD_RU.order}
          >
            <InputNumber style={{ width: '100%' }} />
          </Form.Item>
          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              loading={isCreating || isUpdating}
            >
              {item ? 'Обновить' : 'Создать'}
            </Button>
          </Form.Item>
        </FormContent>
      </Form>
    </Styled.Container>
  )
}

export default BlockForm

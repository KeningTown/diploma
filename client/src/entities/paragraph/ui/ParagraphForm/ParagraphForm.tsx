import React, { useMemo, useCallback, useEffect } from 'react'
import {
  Form,
  Input,
  Select,
  InputNumber,
  Typography,
  Space,
  Tooltip
} from 'antd'

import { attachment, Attachment, AttachmentProps } from '../../../attachment'
import { paragraph, ParagraphProps } from '../../model'
import { Permission, permission } from '../../../permission'

import { getInitialValues } from './ParagraphForm.constants'

import { useNotification, useRequest } from '@/hooks'

import { Size } from '@/ui/theme'
import { Button, FormContent, ButtonModal, Card } from '@/ui'
import TableEditor from '../TableEditor/TableEditor'

import * as Styled from './ParagraphForm.styled'

type Props = {
  blockId: number
  item: ParagraphProps.Item | null
  order: number
  onSuccess: (paragraph: ParagraphProps.Item) => void
  onClose: () => void
}

const ParagraphForm: React.FC<Props> = ({
  blockId,
  item,
  order,
  onSuccess,
  onClose
}) => {
  const notify = useNotification()

  const { request: create, isLoading: isCreating } = useRequest(
    paragraph.api.create
  )
  const { request: update, isLoading: isUpdating } = useRequest(
    paragraph.api.update
  )

  const [form] = Form.useForm()

  const textValue = Form.useWatch('text', form)

  const initialValues = useMemo(
    () => getInitialValues(order, item),
    [item, order]
  )

  useEffect(() => {
    form.setFieldsValue(initialValues)
  }, [form, initialValues])

  const handleSubmit = useCallback(
    (formData: ParagraphProps.CreateData) => {
      if (item) {
        return update(item.id, formData).then(({ error }) => {
          if (error) {
            return notify('error', 'Не удалось обновить абзац')
          }

          onSuccess({ ...item, ...formData })
          notify('success', 'Абзац обновлен')
        })
      }

      create(blockId, formData).then(({ data }) => {
        if (!data) {
          return notify('error', 'Не удалось создать абзац')
        }

        onSuccess({
          ...formData,
          id: data.data.id,
          attachments: []
        })
        notify('success', 'Абзац создан')
      })
    },
    [blockId, item, notify, onSuccess, create, update]
  )

  const handleUpdateAttachments = useCallback(
    (attachment: AttachmentProps.Item, isNew = false) => {
      if (!item) {
        return
      }

      const attachments = isNew
        ? [...item.attachments, attachment]
        : item.attachments.map((item) => {
            if (item.id !== attachment.id) {
              return item
            }

            return attachment
          })

      onSuccess({ ...item, attachments })
    },
    [item, onSuccess]
  )

  const handleDeleteAttachment = useCallback(
    (id: number) => {
      if (!item) {
        return
      }

      const attachments = item.attachments.filter((attachment) => {
        return attachment.id !== id
      })

      onSuccess({ ...item, attachments })
    },
    [item, onSuccess]
  )

  const attachmentMaxOrder = useMemo(() => {
    if (!item?.attachments.length) {
      return 0
    }

    return Math.max(...item.attachments.map(({ order }) => order))
  }, [item])

  return (
    <Styled.Container
      as={Card}
      title={item ? 'Редактирование абзаца' : 'Создание абзаца'}
      extra={<Button icon="close" size="small" type="text" onClick={onClose} />}
    >
      <Form
        layout="vertical"
        form={form}
        initialValues={initialValues}
        onFinish={handleSubmit}
      >
        <FormContent noVerticalSpace layout={[24, 10, 7, 7]}>
          <div>
            <Styled.TableButtonContainer>
              <Tooltip
                title="Редактировать таблицу"
                placement="topRight"
                arrow={{ pointAtCenter: true }}
              >
                <ButtonModal
                  icon="table"
                  size="small"
                  type="text"
                  modal={(props) => (
                    <TableEditor
                      {...props}
                      value={textValue}
                      onApply={(value) => form.setFieldValue('text', value)}
                    />
                  )}
                />
              </Tooltip>
            </Styled.TableButtonContainer>
            <Form.Item
              required
              name="text"
              label={paragraph.constants.FIELD_RU.text}
            >
              <Input.TextArea
                autoSize
                placeholder={paragraph.constants.FIELD_PLACEHOLDER.text}
              />
            </Form.Item>
          </div>
          <Form.Item
            required
            name="type"
            label={paragraph.constants.FIELD_RU.type}
          >
            <Select>
              {Object.entries(paragraph.constants.TYPE_RU).map(
                ([key, value]) => (
                  <Select.Option key={key} value={key}>
                    {value}
                  </Select.Option>
                )
              )}
            </Select>
          </Form.Item>
          <Form.Item
            required
            name="width"
            label={paragraph.constants.FIELD_RU.width}
          >
            <Select
              disabled={
                !item?.attachments.some(
                  (item) =>
                    item.type === attachment.constants.AttachmentType.IMAGE
                )
              }
            >
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
            label={paragraph.constants.FIELD_RU.order}
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
      {item && (
        <>
          <Styled.Divider />
          <Styled.Space as={Space} direction="vertical">
            <Typography.Title level={5}>Вложения</Typography.Title>
            {item.attachments.map((item) => (
              <Attachment.AttachmentForm
                key={item.id}
                item={item}
                order={item.order}
                paragraphId={item.id}
                onSuccess={handleUpdateAttachments}
                onDelete={handleDeleteAttachment}
              />
            ))}
            <Permission.PermissionChecker
              permissions={{
                [permission.constants.PermissionEntity.ATTACHMENT]:
                  permission.constants.PermissionAction.CREATE
              }}
            >
              <Attachment.AttachmentForm
                paragraphId={item?.id}
                order={attachmentMaxOrder + 100}
                onSuccess={handleUpdateAttachments}
              />
            </Permission.PermissionChecker>
          </Styled.Space>
        </>
      )}
    </Styled.Container>
  )
}

export default ParagraphForm

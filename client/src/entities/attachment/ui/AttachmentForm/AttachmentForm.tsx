import React, { useCallback, useMemo } from 'react'
import { Form, Input, Select, InputNumber, Upload, Space } from 'antd'

import { attachment, AttachmentProps } from '../../model'
import { permission, Permission } from '../../../permission'

import { getInitialValues, getFile, FormData } from './AttachmentForm.constants'

import { validation } from '@/services'

import { useRequest, useNotification } from '@/hooks'

import { FormContent, Button, Card } from '@/ui'
import { ButtonRequest } from '@/components'
import File from '../File/File'

type Props = {
  paragraphId: number
  item?: AttachmentProps.Item
  order: number
  onSuccess: (item: AttachmentProps.Item, isNew?: boolean) => void
  onDelete?: (id: number) => void
}

const AttachmentForm: React.FC<Props> = ({
  paragraphId,
  item,
  order,
  onSuccess,
  onDelete
}) => {
  const notify = useNotification()

  const { checkPermissions } = Permission.usePermissionChecker()

  const { request: create, isLoading: isCreating } = useRequest(
    attachment.api.create
  )
  const { request: update, isLoading: isUpdating } = useRequest(
    attachment.api.update
  )

  const [form] = Form.useForm<FormData>()

  const typeValue = Form.useWatch('type', form)
  const isImage = typeValue === attachment.constants.AttachmentType.IMAGE

  const initialValues = useMemo(
    () => getInitialValues(order, item),
    [item, order]
  )

  const handleSubmit = useCallback(
    (formData: FormData) => {
      if (item) {
        return update(paragraphId, formData).then(({ error }) => {
          if (error) {
            return notify('error', 'Не удалось обновить вложение')
          }

          onSuccess({ ...item, ...formData })
          notify('success', 'Вложение обновлено')
        })
      }

      const _data = {
        ...formData,
        file: formData.file[0].originFileObj!
      }

      create(paragraphId, _data).then(({ data }) => {
        if (!data) {
          return notify('error', 'Не удалось создать вложение')
        }

        form.resetFields()
        onSuccess({ ...formData, ...data.data }, true)
        notify('success', 'Вложение создано')
      })
    },
    [create, form, item, notify, onSuccess, paragraphId, update]
  )

  const handleDelete = useCallback(() => {
    if (!item || !onDelete) {
      return
    }

    onDelete(item.id)
  }, [item, onDelete])

  const canUpdateAttachment = item
    ? checkPermissions({
        [permission.constants.PermissionEntity.ATTACHMENT]:
          permission.constants.PermissionAction.UPDATE
      })
    : true

  const canDeleteAttachment = checkPermissions({
    [permission.constants.PermissionEntity.ATTACHMENT]:
      permission.constants.PermissionAction.DELETE
  })

  return (
    <Card>
      <Form
        layout="vertical"
        form={form}
        initialValues={initialValues}
        onFinish={handleSubmit}
      >
        <FormContent noVerticalSpace layout={[12, 12, 24, 24, 8]}>
          {item ? (
            <Form.Item
              name="filename"
              label={attachment.constants.FIELD_RU.file}
            >
              <File item={item} />
            </Form.Item>
          ) : (
            <Form.Item
              required
              valuePropName="fileList"
              name="file"
              label={attachment.constants.FIELD_RU.file}
              rules={[validation.required(validation.REQUIRED_MESSAGE.FILE)]}
              getValueFromEvent={getFile}
            >
              <Upload
                disabled={!canUpdateAttachment}
                beforeUpload={() => false}
              >
                <Button icon="upload">Загрузить файл</Button>
              </Upload>
            </Form.Item>
          )}
          <Form.Item
            required
            name="type"
            label={attachment.constants.FIELD_RU.type}
          >
            <Select disabled={!canUpdateAttachment}>
              {Object.entries(attachment.constants.TYPE_RU).map(
                ([key, value]) => (
                  <Select.Option key={key} value={key}>
                    {value}
                  </Select.Option>
                )
              )}
            </Select>
          </Form.Item>
          {isImage && (
            <Form.Item
              required
              name="title"
              label={attachment.constants.FIELD_RU.title}
              rules={[validation.required(validation.REQUIRED_MESSAGE.TITLE)]}
            >
              <Input.TextArea
                autoSize
                placeholder={attachment.constants.FIELD_PLACEHOLDER.title}
                disabled={!canUpdateAttachment}
              />
            </Form.Item>
          )}
          {isImage && (
            <Form.Item
              name="description"
              label={attachment.constants.FIELD_RU.description}
            >
              <Input.TextArea
                autoSize
                placeholder={attachment.constants.FIELD_PLACEHOLDER.description}
                disabled={!canUpdateAttachment}
              />
            </Form.Item>
          )}
          <Form.Item
            required
            name="order"
            label={attachment.constants.FIELD_RU.order}
            rules={[validation.required(validation.REQUIRED_MESSAGE.ORDER)]}
          >
            <InputNumber
              disabled={!canUpdateAttachment}
              style={{ width: '100%' }}
            />
          </Form.Item>
          <Form.Item>
            <Space>
              {canUpdateAttachment && (
                <Button
                  type="primary"
                  htmlType="submit"
                  loading={isCreating || isUpdating}
                >
                  {item ? 'Обновить' : 'Создать'}
                </Button>
              )}
              {item && canDeleteAttachment && (
                <ButtonRequest
                  danger
                  request={attachment.api.delete}
                  args={[item.id]}
                  successMessage="Вложение удалено"
                  errorMessage="Не удалось удалить вложение"
                  onSuccess={handleDelete}
                >
                  Удалить
                </ButtonRequest>
              )}
            </Space>
          </Form.Item>
        </FormContent>
      </Form>
    </Card>
  )
}

export default AttachmentForm

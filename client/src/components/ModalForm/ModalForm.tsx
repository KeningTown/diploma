import React, { useCallback, useEffect } from 'react'
import { Modal, Form } from 'antd'

import { ModalFormProps } from './ModalForm.types'

const ModalForm: React.FC<ModalFormProps> = ({
  okText,
  isLoading: loading,
  isSuccess,
  initialValues,
  children,
  onSubmit,
  onCancel,
  ...rest
}) => {
  const [form] = Form.useForm()

  const handleOk = useCallback(() => {
    form.submit()
  }, [form])

  const handleSuccess = useCallback(() => {
    onCancel()
    form.resetFields()
  }, [form, onCancel])

  useEffect(() => {
    isSuccess && handleSuccess()
  }, [handleSuccess, isSuccess])

  return (
    <Modal
      {...rest}
      cancelText="Отмена"
      cancelButtonProps={{ disabled: loading }}
      okText={okText}
      okButtonProps={{ loading }}
      onOk={handleOk}
      onCancel={onCancel}
    >
      <Form
        layout="vertical"
        form={form}
        initialValues={initialValues}
        onFinish={onSubmit}
      >
        {children}
      </Form>
    </Modal>
  )
}

export default ModalForm

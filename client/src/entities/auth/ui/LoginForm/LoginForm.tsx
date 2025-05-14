import React, { useCallback } from 'react'
import { Form, Input, Button } from 'antd'

import { AuthProps, auth } from '../../model'
import { user } from '../../../user'

import { useRequest, useNotification } from '@/hooks'

const LoginForm: React.FC = () => {
  const notify = useNotification()

  const [form] = Form.useForm()

  const { request: login } = useRequest(auth.api.login)

  const handleSubmit = useCallback(
    (data: AuthProps.LoginData) => {
      login(data).then(({ data }) => {
        if (!data) {
          return notify('error', 'Не удалось войти')
        }

        auth.service.handleLogin(data)
      })
    },
    [login, notify]
  )

  return (
    <Form layout="vertical" form={form} onFinish={handleSubmit}>
      <Form.Item name="email" label={user.constants.USER_FIELD_RU.email}>
        <Input placeholder={user.constants.USER_FIELD_PLACEHOLDER.email} />
      </Form.Item>
      <Form.Item name="password" label={user.constants.USER_FIELD_RU.password}>
        <Input.Password name="password" />
      </Form.Item>
      <Button type="primary" htmlType="submit">
        Войти
      </Button>
    </Form>
  )
}

export default LoginForm

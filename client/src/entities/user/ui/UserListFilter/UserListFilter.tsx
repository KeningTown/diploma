import React from 'react'
import {
  Form,
  Input,
  Select,
  Button
  // Dropdown,
  // Space,
  // Popover,
  // Typography
} from 'antd'
// import { FilterOutlined } from '@ant-design/icons'

import { user } from '../../model'
import { FormData } from './UserListFilter.types'

import { INITIAL_VALUES, IS_ACTIVE_OPTIONS } from './UserListFilter.constants'

import {
  FormContent,
  InputMultiple
  // Tag
} from '@/ui'

type Props = {
  onFilter: (data: FormData) => void
}

const UserListFilter: React.FC<Props> = ({ onFilter }) => {
  const [form] = Form.useForm()

  const handleSubmit = (data: FormData) => {
    onFilter(data)
  }

  return (
    <>
      {/* <Space style={{ marginBottom: 16 }}>
        <Dropdown
          arrow={{ pointAtCenter: true }}
          trigger={['click']}
          menu={{
            items: [
              {
                key: 'id',
                label: 'ID'
              },
              {
                key: 'fullName',
                label: 'ФИО'
              },
              {
                key: 'isActive',
                label: 'Статус'
              }
            ]
          }}
        >
          <Button size="small" icon={<FilterOutlined />} />
        </Dropdown>
        <Popover
          trigger="click"
          placement="bottom"
          content={
            <Space direction="vertical">
              <Typography.Text>Статус</Typography.Text>
              <Select
                allowClear
                placeholder={user.constants.USER_FIELD_PLACEHOLDER.active}
                options={IS_ACTIVE_OPTIONS}
                style={{ width: 120 }}
              />
            </Space>
          }
        >
          <Tag style={{ height: 24 }} onClose={(e) => e.stopPropagation()}>
            Статус:&nbsp;
            <Typography.Text strong>Активен</Typography.Text>
          </Tag>
        </Popover>
      </Space> */}
      <Form
        // layout="vertical"
        form={form}
        initialValues={INITIAL_VALUES}
        onFinish={handleSubmit}
      >
        <FormContent inline>
          <Form.Item name="userIds" label={user.constants.USER_FIELD_RU.id}>
            <InputMultiple
              placeholder={user.constants.USER_FIELD_PLACEHOLDER.id}
              style={{ width: 190 }}
            />
          </Form.Item>
          <Form.Item name="name" label={user.constants.USER_FIELD_RU.fullName}>
            <Input
              allowClear
              placeholder={user.constants.USER_FIELD_PLACEHOLDER.lastName}
              style={{ width: 210 }}
            />
          </Form.Item>
          <Form.Item name="isActive" label="Статус">
            <Select
              allowClear
              placeholder={user.constants.USER_FIELD_PLACEHOLDER.active}
              options={IS_ACTIVE_OPTIONS}
              style={{ width: 120 }}
            />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit">
              Найти
            </Button>
          </Form.Item>
        </FormContent>
      </Form>
    </>
  )
}

export default UserListFilter

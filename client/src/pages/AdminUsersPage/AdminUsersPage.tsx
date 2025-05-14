import React from 'react'
import { Space } from 'antd'

import { user, User, Permission, permission } from '@/entities'

import { useFilter } from '@/hooks'

import { ButtonModal } from '@/ui'
import { Page, Fetcher } from '@/components'

const AdminUsersPage: React.FC = () => {
  const { filter, onFilter } = useFilter()

  return (
    <Page>
      <Page.Title
        extra={
          <Permission.PermissionChecker
            permissions={{
              [permission.constants.PermissionEntity.USER]:
                permission.constants.PermissionAction.CREATE
            }}
          >
            <ButtonModal
              icon="plus"
              modal={(props) => (
                <User.UserFormModal {...props} onSuccess={onFilter} />
              )}
            >
              Создать пользователя
            </ButtonModal>
          </Permission.PermissionChecker>
        }
      >
        Пользователи
      </Page.Title>
      <Page.Section>
        <Space direction="vertical" size="middle" align="start">
          <User.UserListFilter onFilter={onFilter} />
          <Fetcher paginate filter={filter} request={user.api.list}>
            {User.UserList}
          </Fetcher>
        </Space>
      </Page.Section>
    </Page>
  )
}

export default AdminUsersPage

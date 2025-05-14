import React from 'react'

import { User, user, Permission, permission } from '@/entities'

import { ADMIN_USERS } from '@/routes'

import { ButtonModal } from '@/ui'
import { Page, Fetcher } from '@/components'

const AdminUserPage: React.FC = () => {
  return (
    <Page>
      <Fetcher loader fromPath request={user.api.read}>
        {({ data, reload }) => (
          <>
            <Page.Title
              backTo={ADMIN_USERS}
              extra={
                <>
                  <Permission.PermissionChecker
                    permissions={{
                      [permission.constants.PermissionEntity.USER]:
                        permission.constants.PermissionAction.UPDATE
                    }}
                  >
                    <ButtonModal
                      icon="edit"
                      modal={(props) => (
                        <User.UserFormModal
                          {...props}
                          item={data}
                          onSuccess={reload}
                        />
                      )}
                    >
                      Редактировать
                    </ButtonModal>
                  </Permission.PermissionChecker>
                  <Permission.PermissionChecker
                    permissions={{
                      [permission.constants.PermissionEntity.USER]:
                        permission.constants.PermissionAction.UPDATE
                    }}
                  >
                    <User.UserChangePassword item={data} />
                  </Permission.PermissionChecker>
                </>
              }
            >
              Пользователь {user.service.getShortName(data)}
            </Page.Title>
            <Page.Section>
              <User.UserInfo item={data} />
            </Page.Section>
          </>
        )}
      </Fetcher>
    </Page>
  )
}

export default AdminUserPage

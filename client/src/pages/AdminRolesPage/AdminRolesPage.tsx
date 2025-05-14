import React from 'react'

import { role, Role, Permission, permission } from '@/entities'

import { ButtonModal } from '@/ui'
import { Page, Fetcher } from '@/components'

const CAN_CREATE = false

const AdminRolesPage: React.FC = () => {
  return (
    <Page>
      <Fetcher request={role.api.list}>
        {({ reload, ...props }) => (
          <>
            <Page.Title
              extra={
                CAN_CREATE && (
                  <Permission.PermissionChecker
                    permissions={{
                      [permission.constants.PermissionEntity.ROLE]:
                        permission.constants.PermissionAction.CREATE
                    }}
                  >
                    <ButtonModal
                      icon="plus"
                      modal={(props) => (
                        <Role.RoleFormModal {...props} onSuccess={reload} />
                      )}
                    >
                      Создать роль
                    </ButtonModal>
                  </Permission.PermissionChecker>
                )
              }
            >
              Роли
            </Page.Title>
            <Page.Section>
              <Role.RoleList {...props} />
            </Page.Section>
          </>
        )}
      </Fetcher>
    </Page>
  )
}

export default AdminRolesPage

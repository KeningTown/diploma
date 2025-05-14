import React from 'react'

import { role, Role, Permission, permission } from '@/entities'

import { ADMIN_ROLES } from '@/routes'

import { ButtonModal } from '@/ui'
import { Page, Fetcher } from '@/components'

const AdminRolePage: React.FC = () => {
  return (
    <Page>
      <Fetcher loader fromPath request={role.api.read}>
        {({ data, reload }) => (
          <>
            <Page.Title
              backTo={ADMIN_ROLES}
              extra={
                data.type !== role.constants.RoleType.BASIC && (
                  <>
                    <Permission.PermissionChecker
                      permissions={{
                        [permission.constants.PermissionEntity.ROLE]:
                          permission.constants.PermissionAction.UPDATE
                      }}
                    >
                      <ButtonModal
                        icon="edit"
                        modal={(props) => (
                          <Role.RoleFormModal
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
                        [permission.constants.PermissionEntity.ROLE]:
                          permission.constants.PermissionAction.DELETE
                      }}
                    >
                      <Role.DeleteButton {...data} />
                    </Permission.PermissionChecker>
                  </>
                )
              }
            >
              Роль {data.name}
            </Page.Title>
            <Page.Section>
              <Role.RoleInfo item={data} />
              {data.permissions && (
                <Permission.PermissionChecker
                  permissions={{
                    [permission.constants.PermissionEntity.ROLE_PERMISSION]:
                      permission.constants.PermissionAction.LIST
                  }}
                >
                  <Permission.PermissionTable permissions={data.permissions} />
                </Permission.PermissionChecker>
              )}
            </Page.Section>
          </>
        )}
      </Fetcher>
    </Page>
  )
}

export default AdminRolePage

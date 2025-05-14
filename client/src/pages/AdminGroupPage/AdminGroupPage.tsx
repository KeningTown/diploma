import React from 'react'

import { group, Group, Permission, permission } from '@/entities'

import { ADMIN_GROUPS } from '@/routes'

import { ButtonModal } from '@/ui'
import { Page, Fetcher } from '@/components'

const AdminGroupPage: React.FC = () => {
  return (
    <Page>
      <Fetcher loader fromPath request={group.api.read}>
        {({ data, reload }) => (
          <>
            <Page.Title
              backTo={ADMIN_GROUPS}
              extra={
                <>
                  <Permission.PermissionChecker
                    permissions={{
                      [permission.constants.PermissionEntity.GROUP]:
                        permission.constants.PermissionAction.UPDATE
                    }}
                  >
                    <ButtonModal
                      icon="edit"
                      modal={(props) => (
                        <Group.GroupFormModal
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
                      [permission.constants.PermissionEntity.GROUP]:
                        permission.constants.PermissionAction.DELETE
                    }}
                  >
                    <Group.GroupDelete item={data} />
                  </Permission.PermissionChecker>
                </>
              }
            >
              Группа {data.name}
            </Page.Title>
            <Page.Section>
              <Group.GroupInfo item={data} />
            </Page.Section>
          </>
        )}
      </Fetcher>
    </Page>
  )
}

export default AdminGroupPage

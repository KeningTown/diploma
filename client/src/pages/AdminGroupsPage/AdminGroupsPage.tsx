import React from 'react'

import { group, Group, Permission, permission } from '@/entities'

import { ButtonModal } from '@/ui'
import { Page, Fetcher } from '@/components'

const AdminGroupsPage: React.FC = () => {
  return (
    <Page>
      <Fetcher request={group.api.list}>
        {({ reload, ...props }) => (
          <>
            <Page.Title
              extra={
                <Permission.PermissionChecker
                  permissions={{
                    [permission.constants.PermissionEntity.GROUP]:
                      permission.constants.PermissionAction.CREATE
                  }}
                >
                  <ButtonModal
                    icon="plus"
                    modal={(props) => (
                      <Group.GroupFormModal {...props} onSuccess={reload} />
                    )}
                  >
                    Создать группу
                  </ButtonModal>
                </Permission.PermissionChecker>
              }
            >
              Группы
            </Page.Title>
            <Page.Section>
              <Group.GroupList {...props} />
            </Page.Section>
          </>
        )}
      </Fetcher>
    </Page>
  )
}

export default AdminGroupsPage

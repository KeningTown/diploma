import React from 'react'

import { document, Document, Permission, permission } from '@/entities'

import { ButtonModal } from '@/ui'
import { Page, Fetcher } from '@/components'

const AdminDocumentsPage: React.FC = () => {
  return (
    <Page>
      <Fetcher paginate request={document.api.list}>
        {({ reload, ...props }) => (
          <>
            <Page.Title
              extra={
                <Permission.PermissionChecker
                  permissions={{
                    [permission.constants.PermissionEntity.DOCUMENT]:
                      permission.constants.PermissionAction.CREATE
                  }}
                >
                  <ButtonModal
                    icon="plus"
                    modal={(props) => (
                      <Document.DocumentFormModal
                        {...props}
                        onSuccess={reload}
                      />
                    )}
                  >
                    Создать документ
                  </ButtonModal>
                </Permission.PermissionChecker>
              }
            >
              Документы
            </Page.Title>
            <Page.Section>
              <Document.DocumentList {...props} />
            </Page.Section>
          </>
        )}
      </Fetcher>
    </Page>
  )
}

export default AdminDocumentsPage

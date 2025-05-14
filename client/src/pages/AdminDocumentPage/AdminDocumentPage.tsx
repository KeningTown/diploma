import React from 'react'

import { Document, document, Permission, permission } from '@/entities'

import { ADMIN_DOCUMENTS, ADMIN_DOCUMENT_CONTENT } from '@/routes'

import { Page, Fetcher } from '@/components'
import { ButtonModal, ButtonLink } from '@/ui'

const AdminDocumentPage: React.FC = () => {
  return (
    <Page>
      <Fetcher loader fromPath request={document.api.read}>
        {({ data, reload }) => (
          <>
            <Page.Title
              backTo={ADMIN_DOCUMENTS}
              extra={
                <>
                  <Permission.PermissionChecker
                    permissions={{
                      [permission.constants.PermissionEntity.BLOCK]:
                        permission.constants.PermissionAction.LIST
                    }}
                  >
                    <ButtonLink
                      icon="content"
                      to={ADMIN_DOCUMENT_CONTENT}
                      params={{ id: data.id }}
                    >
                      Содержание
                    </ButtonLink>
                  </Permission.PermissionChecker>
                  <Permission.PermissionChecker
                    permissions={{
                      [permission.constants.PermissionEntity.DOCUMENT]:
                        permission.constants.PermissionAction.UPDATE
                    }}
                  >
                    <ButtonModal
                      icon="edit"
                      modal={(props) => (
                        <Document.DocumentFormModal
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
                      [permission.constants.PermissionEntity.DOCUMENT]:
                        permission.constants.PermissionAction.DELETE
                    }}
                  >
                    <Document.DocumentDelete item={data} />
                  </Permission.PermissionChecker>
                </>
              }
            >
              {data.title}
            </Page.Title>
            <Page.Section>
              <Document.DocumentInfo item={data} />
            </Page.Section>
          </>
        )}
      </Fetcher>
    </Page>
  )
}

export default AdminDocumentPage

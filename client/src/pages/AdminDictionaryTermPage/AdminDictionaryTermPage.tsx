import React from 'react'

import { term, Term, Permission, permission } from '@/entities'

import { ADMIN_DICTIONARY_TERMS } from '@/routes'

import { Page, Fetcher } from '@/components'
import { ButtonModal } from '@/ui'

const AdminDictionaryTermPage: React.FC = () => {
  return (
    <Page>
      <Fetcher loader fromPath request={term.api.read}>
        {({ data, reload }) => {
          return (
            <>
              <Page.Title
                backTo={ADMIN_DICTIONARY_TERMS}
                extra={
                  <>
                    <Permission.PermissionChecker
                      permissions={{
                        [permission.constants.PermissionEntity.TERM]:
                          permission.constants.PermissionAction.UPDATE
                      }}
                    >
                      <ButtonModal
                        icon="edit"
                        modal={(props) => (
                          <Term.TermFormModal
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
                        [permission.constants.PermissionEntity.TERM]:
                          permission.constants.PermissionAction.DELETE
                      }}
                    >
                      <Term.TermDelete item={data} />
                    </Permission.PermissionChecker>
                  </>
                }
              >
                Термин {data.term}
              </Page.Title>
              <Page.Section>
                <Term.TermInfo item={data} reload={reload} />
              </Page.Section>
            </>
          )
        }}
      </Fetcher>
    </Page>
  )
}

export default AdminDictionaryTermPage

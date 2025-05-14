import React from 'react'

import { term, Term, Permission, permission, TermRelation } from '@/entities'

import { useReload } from '@/hooks'

import { Page, Fetcher } from '@/components'
import { ButtonModal } from '@/ui'

import * as Styled from './TermsTab.styled'

const TermsTab: React.FC = () => {
  const { isReloaded, reload } = useReload()

  return (
    <>
      <Page.Title
        extra={
          <>
            <Permission.PermissionChecker
              permissions={{
                [permission.constants.PermissionEntity.TERM]:
                  permission.constants.PermissionAction.CREATE
              }}
            >
              <ButtonModal
                icon="plus"
                modal={(props) => (
                  <Term.TermFormModal {...props} onSuccess={reload} />
                )}
              >
                Добавить термин
              </ButtonModal>
            </Permission.PermissionChecker>
            <Permission.PermissionChecker
              permissions={{
                [permission.constants.PermissionEntity.TERM]:
                  permission.constants.PermissionAction.LIST
              }}
            >
              <ButtonModal icon="graph" modal={Term.TermGraphModal}>
                Построить граф
              </ButtonModal>
            </Permission.PermissionChecker>
          </>
        }
      />
      <Page.Section>
        <Styled.Row>
          <TermRelation.RelationTags />
        </Styled.Row>
        <Fetcher paginate isReloaded={isReloaded} request={term.api.list}>
          {Term.TermList}
        </Fetcher>
      </Page.Section>
    </>
  )
}

export default TermsTab

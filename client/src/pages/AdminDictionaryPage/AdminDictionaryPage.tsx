import React, { useMemo } from 'react'

import { Permission } from '@/entities'

import { getTabs } from './AdminDictionaryPage.constants'

import { Page } from '@/components'

const AdminDictionaryPage: React.FC = () => {
  const { checkPermissions } = Permission.usePermissionChecker()

  const tabs = useMemo(() => getTabs(checkPermissions), [checkPermissions])

  return (
    <Page>
      <Page.Title>Словарь</Page.Title>
      <Page.Tabs tabs={tabs} />
    </Page>
  )
}

export default AdminDictionaryPage

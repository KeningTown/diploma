import React from 'react'

import { Record, record } from '@/entities'

import { Page, Fetcher } from '@/components'

const AdminRecordsPage: React.FC = () => {
  return (
    <Page>
      <Page.Title>Мониторинг</Page.Title>
      <Page.Section>
        <Fetcher request={record.api.list}>{Record.RecordList}</Fetcher>
      </Page.Section>
    </Page>
  )
}

export default AdminRecordsPage

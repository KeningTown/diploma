import React from 'react'

import { Record, record } from '@/entities'

import { ADMIN_RECORDS } from '@/routes'

import { Page, Fetcher } from '@/components'

const AdminRecordPage: React.FC = () => {
  return (
    <Page>
      <Fetcher loader fromPath request={record.api.read}>
        {({ data }) => {
          return (
            <>
              <Page.Title backTo={ADMIN_RECORDS}>
                Результат мониторинга {data.id}
              </Page.Title>
              <Page.Section>
                <Record.RecordInfo item={data} />
                <Record.RecordResult
                  document={data.document}
                  data={data.data}
                />
                <Record.RecordTerms data={data.data} />
              </Page.Section>
              <Record.RecordData data={data.data} />
            </>
          )
        }}
      </Fetcher>
    </Page>
  )
}

export default AdminRecordPage

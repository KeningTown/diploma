import React from 'react'
import { Row, Typography } from 'antd'

import { Document, document } from '@/entities'

import { getGutter } from '@/ui/theme'
import { Page, Fetcher } from '@/components'

const GUTTER = getGutter(2)

const DocumentsPage: React.FC = () => {
  return (
    <Page fullWidth>
      <Fetcher paginate request={document.api.listAvailable}>
        {({ data }) => {
          if (data && !data.data.length) {
            return (
              <Typography.Paragraph>
                Нет назначенных документов
              </Typography.Paragraph>
            )
          }

          return (
            <Row gutter={GUTTER}>
              {data ? (
                data.data.map((item) => (
                  <Document.DocumentCard key={item.id} item={item} />
                ))
              ) : (
                <Document.DocumentCard />
              )}
            </Row>
          )
        }}
      </Fetcher>
    </Page>
  )
}

export default DocumentsPage

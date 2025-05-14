import React from 'react'
import { Typography } from 'antd'

import { document } from '@/entities'

import { DOCUMENTS, DOCUMENT_CONTENT } from '@/routes'

import { Page, Fetcher } from '@/components'
import { ButtonLink } from '@/ui'

const DocumentPage: React.FC = () => {
  return (
    <Page centered>
      <Fetcher loader fromPath request={document.api.read}>
        {({ data }) => (
          <>
            <Page.Title backTo={DOCUMENTS}>{data.title}</Page.Title>
            <Page.Section>
              <Typography.Paragraph>{data.abstract}</Typography.Paragraph>
              <ButtonLink to={DOCUMENT_CONTENT} params={{ id: data.id }}>
                Перейти к содержанию
              </ButtonLink>
            </Page.Section>
          </>
        )}
      </Fetcher>
    </Page>
  )
}

export default DocumentPage

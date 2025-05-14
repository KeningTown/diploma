import React from 'react'

import { document, block, Block } from '@/entities'

import { DOCUMENT } from '@/routes'

import { Page, Fetcher } from '@/components'

const DocumentContentPage: React.FC = () => {
  return (
    <Page centered>
      <Fetcher loader fromPath request={document.api.read}>
        {({ data: document }) => (
          <>
            <Page.Title backTo={DOCUMENT} backParams={{ id: document.id }}>
              {document.title}
            </Page.Title>
            <Fetcher loader fromPath request={block.api.listAvailable}>
              {({ data }) => (
                <Block.BlockGrid documentId={document.id} items={data.data} />
              )}
            </Fetcher>
          </>
        )}
      </Fetcher>
    </Page>
  )
}

export default DocumentContentPage

import React from 'react'

import { document, block, Block } from '@/entities'

import { ADMIN_DOCUMENT } from '@/routes'

import { Page, Fetcher } from '@/components'

const AdminDocumentContentPage: React.FC = () => {
  return (
    <Page>
      {({ setRightPanel }) => (
        <Fetcher loader fromPath request={document.api.read}>
          {({ data: document }) => (
            <>
              <Page.Title
                backTo={ADMIN_DOCUMENT}
                backParams={{ id: document.id }}
              >
                Содержание документа {document.title}
              </Page.Title>
              <Fetcher loader fromPath request={block.api.list}>
                {({ data }) => (
                  <Block.BlockGridAdmin
                    documentId={document.id}
                    items={data.data}
                    setRightPanel={setRightPanel}
                  />
                )}
              </Fetcher>
            </>
          )}
        </Fetcher>
      )}
    </Page>
  )
}

export default AdminDocumentContentPage

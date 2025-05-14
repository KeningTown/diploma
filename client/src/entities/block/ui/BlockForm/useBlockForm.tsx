import React, { useEffect, useMemo } from 'react'

import { BlockProps } from '../../model'

import { SetRightPanel } from '@/components'
import BlockForm from './BlockForm'

type Props = {
  documentId: number
  orderedBlocks: Array<BlockProps.Item>
  selectedBlock?: BlockProps.Item | null
  setSelectedBlock: (block?: BlockProps.Item | null) => void
  setRightPanel: SetRightPanel
  onSuccess: (block: BlockProps.Item) => void
  onClose: () => void
}

export const useBlockForm = ({
  documentId,
  orderedBlocks,
  selectedBlock,
  setRightPanel,
  onSuccess,
  onClose
}: Props) => {
  const order = useMemo(() => {
    if (selectedBlock) {
      return selectedBlock.order
    }

    if (orderedBlocks.length) {
      return orderedBlocks.slice(-1)[0].order + 100
    }

    return 100
  }, [selectedBlock, orderedBlocks])

  useEffect(() => {
    if (selectedBlock !== undefined) {
      setRightPanel(
        <BlockForm
          documentId={documentId}
          item={selectedBlock}
          order={order}
          onSuccess={onSuccess}
          onClose={onClose}
        />
      )
    }
  }, [documentId, onClose, onSuccess, order, selectedBlock, setRightPanel])
}

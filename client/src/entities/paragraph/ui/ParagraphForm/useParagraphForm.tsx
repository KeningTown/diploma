import React, { useEffect, useMemo } from 'react'

import { ParagraphProps } from '../../model'

import { SetRightPanel } from '@/components'
import ParagraphForm from './ParagraphForm'

type Props = {
  blockId: number
  orderedParagraphs: Array<ParagraphProps.Item>
  selectedParagraph?: ParagraphProps.Item | null
  setRightPanel: SetRightPanel
  onSuccess: (paragraph: ParagraphProps.Item) => void
  onClose: () => void
}

export const useParagraphForm = ({
  blockId,
  orderedParagraphs,
  selectedParagraph,
  setRightPanel,
  onSuccess,
  onClose
}: Props) => {
  const order = useMemo(() => {
    if (selectedParagraph) {
      return selectedParagraph.order
    }

    if (orderedParagraphs.length) {
      return orderedParagraphs.slice(-1)[0].order + 100
    }

    return 100
  }, [orderedParagraphs, selectedParagraph])

  useEffect(() => {
    if (selectedParagraph !== undefined) {
      setRightPanel(
        <ParagraphForm
          blockId={blockId}
          item={selectedParagraph}
          order={order}
          onSuccess={onSuccess}
          onClose={onClose}
        />
      )
    }
  }, [onClose, onSuccess, blockId, order, selectedParagraph, setRightPanel])
}

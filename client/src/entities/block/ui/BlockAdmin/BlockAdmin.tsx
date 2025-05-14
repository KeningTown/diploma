import React, { useState, useMemo, useCallback, useEffect } from 'react'

import { BlockProps } from '../../model'
import { Paragraph, ParagraphProps } from '../../../paragraph'

import { useParagraphForm } from '../../../paragraph/ui/ParagraphForm/useParagraphForm'

import { SetRightPanel } from '@/components'
import BlockMenu from './BlockMenu'
import ParagraphAdd from './ParagraphAdd'
import BlockView from '../BlockView/BlockView'

type Props = {
  isSelected?: boolean
  item: BlockProps.Item
  selectedBlock?: BlockProps.Item | null
  setSelectedBlock: (block: BlockProps.Item | null | undefined) => void
  setRightPanel: SetRightPanel
  onSelect: (block: BlockProps.Item | null) => void
  onDelete: (blockId: number) => void
}

const BlockAdmin: React.FC<Props> = ({
  isSelected = false,
  item,
  selectedBlock,
  setSelectedBlock,
  setRightPanel,
  onSelect,
  onDelete
}) => {
  const [paragraphs, setParagraphs] = useState(item.paragraphs)

  const orderedParagraphs = useMemo(
    () => [...paragraphs].sort((a, b) => a.order - b.order),
    [paragraphs]
  )

  const [selectedParagraph, setSelectedParagraph] =
    useState<ParagraphProps.Item | null>()

  useEffect(() => {
    if (selectedBlock) {
      setSelectedParagraph(undefined)
    }
  }, [selectedBlock])

  const handleSelectParagraph = useCallback(
    (paragraph: ParagraphProps.Item | null) => {
      setSelectedBlock(undefined)
      setSelectedParagraph(paragraph)
    },
    [setSelectedBlock]
  )

  const handleUpdateParagraphs = useCallback(
    (newParagraph: ParagraphProps.Item) => {
      setParagraphs((paragraphs) => {
        if (selectedParagraph === null) {
          return [...paragraphs, newParagraph]
        }

        return paragraphs.map((paragraph) => {
          if (paragraph.id !== selectedParagraph?.id) {
            return paragraph
          }

          return newParagraph
        })
      })
      setSelectedParagraph(newParagraph)
    },
    [selectedParagraph]
  )

  const handleCloseParagraph = useCallback(() => {
    setRightPanel(null)
    setSelectedParagraph(undefined)
  }, [setRightPanel, setSelectedParagraph])

  useParagraphForm({
    blockId: item.id,
    orderedParagraphs,
    selectedParagraph,
    setRightPanel,
    onSuccess: handleUpdateParagraphs,
    onClose: handleCloseParagraph
  })

  const handleAddParagraph = useCallback(() => {
    setSelectedParagraph(null)
  }, [])

  const handleDeleteParagraph = useCallback(
    (id: number) => {
      handleCloseParagraph()
      setParagraphs((paragraphs) => {
        return paragraphs.filter((paragraph) => {
          return paragraph.id !== id
        })
      })
    },
    [handleCloseParagraph]
  )

  return (
    <BlockView
      isSelected={isSelected}
      item={item}
      extra={<BlockMenu item={item} onSelect={onSelect} onDelete={onDelete} />}
    >
      {orderedParagraphs.map((paragraph, i) => (
        <Paragraph.ParagraphAdmin
          key={paragraph.id}
          isSelected={paragraph.id === selectedParagraph?.id}
          prevItemId={orderedParagraphs[i - 1]?.id}
          item={paragraph}
          block={item}
          onSelect={handleSelectParagraph}
          onDelete={handleDeleteParagraph}
        />
      ))}
      <ParagraphAdd onAdd={handleAddParagraph} />
    </BlockView>
  )
}

export default BlockAdmin

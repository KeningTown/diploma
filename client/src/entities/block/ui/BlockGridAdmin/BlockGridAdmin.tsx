import React, { useState, useMemo, useCallback } from 'react'

import { BlockProps } from '../../model'

import { useBlockForm } from '../BlockForm/useBlockForm'

import { SetRightPanel } from '@/components'
import BlockGridView from '../BlockGridView/BlockGridView'
import BlockAdmin from '../BlockAdmin/BlockAdmin'
import BlockAdd from './BlockAdd'

type Props = {
  documentId: number
  items: BlockProps.Item[]
  setRightPanel: SetRightPanel
}

const BlockGridAdmin: React.FC<Props> = ({
  documentId,
  items,
  setRightPanel
}) => {
  const [blocks, setBlocks] = useState(items)

  const orderedBlocks = useMemo(
    () => [...blocks].sort((a, b) => a.order - b.order),
    [blocks]
  )

  const [selectedBlock, setSelectedBlock] = useState<BlockProps.Item | null>()

  const handleUpdateBlocks = useCallback(
    (newBlock: BlockProps.Item) => {
      setBlocks((blocks) => {
        if (selectedBlock === null) {
          return [...blocks, newBlock]
        }

        return blocks.map((block) => {
          if (block.id !== selectedBlock?.id) {
            return block
          }

          return newBlock
        })
      })
      setSelectedBlock(newBlock)
    },
    [selectedBlock]
  )

  const handleCloseBlock = useCallback(() => {
    setRightPanel(null)
    setSelectedBlock(undefined)
  }, [setRightPanel, setSelectedBlock])

  useBlockForm({
    documentId,
    orderedBlocks,
    selectedBlock,
    setSelectedBlock,
    setRightPanel,
    onSuccess: handleUpdateBlocks,
    onClose: handleCloseBlock
  })

  const handleDeleteBlock = useCallback(
    (id: number) => {
      handleCloseBlock()
      setBlocks((blocks) => {
        return blocks.filter((block) => {
          return block.id !== id
        })
      })
    },
    [handleCloseBlock]
  )

  const handleAddBlock = useCallback(() => {
    setSelectedBlock(null)
  }, [])

  return (
    <BlockGridView>
      {orderedBlocks.map((item) => (
        <BlockAdmin
          key={item.id}
          isSelected={item.id === selectedBlock?.id}
          item={item}
          selectedBlock={selectedBlock}
          setSelectedBlock={setSelectedBlock}
          setRightPanel={setRightPanel}
          onSelect={setSelectedBlock}
          onDelete={handleDeleteBlock}
        />
      ))}
      <BlockAdd onAdd={handleAddBlock} />
    </BlockGridView>
  )
}

export default BlockGridAdmin

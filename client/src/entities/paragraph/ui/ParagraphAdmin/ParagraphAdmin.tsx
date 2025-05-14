import React, { useMemo } from 'react'

import { ParagraphProps } from '../../model'
import { BlockProps } from '../../../block'

import Text from '../Text/Text'
import ParagraphMenu from './ParagraphMenu'
import ParagraphView from '../ParagraphView/ParagraphView'
import ParagraphDistance from './ParagraphDistance/ParagraphDistance'

type Props = {
  isSelected?: boolean
  prevItemId?: number
  item: ParagraphProps.Item
  block: BlockProps.Item
  onSelect: (paragraph: ParagraphProps.Item | null) => void
  onDelete: (paragraphId: number) => void
}

const ParagraphAdmin: React.FC<Props> = ({
  isSelected = false,
  prevItemId,
  item,
  block,
  onSelect,
  onDelete
}) => {
  const distance = useMemo(() => {
    if (!block.distance || prevItemId === undefined) {
      return undefined
    }

    return block.distance[item.id]?.[prevItemId]
  }, [block.distance, item.id, prevItemId])

  return (
    <ParagraphView item={item} blockWidth={block.width}>
      <Text
        isSelected={isSelected}
        paragraphId={item.id}
        text={item.text}
        block={block}
      />
      <ParagraphMenu item={item} onSelect={onSelect} onDelete={onDelete} />
      {distance !== undefined && <ParagraphDistance value={distance} />}
    </ParagraphView>
  )
}

export default ParagraphAdmin

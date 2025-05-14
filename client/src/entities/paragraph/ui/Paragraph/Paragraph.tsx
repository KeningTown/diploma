import React from 'react'

import { ParagraphProps, paragraph } from '../../model'
import { BlockProps } from '../../../block'

import { useDocumentStore } from '@/store'

import { Button } from '@/ui'
import ParagraphView from '../ParagraphView/ParagraphView'
import Text from '../Text/Text'
import Definition from '../Definition/Definition'

type Props = {
  item: ParagraphProps.ItemAvailable | ParagraphProps.Definition
  block: BlockProps.ItemAvailable
  isRecord: boolean
}

const Paragraph: React.FC<Props> = ({ item, block, isRecord }) => {
  const { onShowNextParagraph } = useDocumentStore(
    ({ onShowNextParagraph }) => ({ onShowNextParagraph })
  )

  if (item.type === paragraph.constants.ParagraphType.DEFINITION) {
    return <Definition item={item} block={block} isRecord={isRecord} />
  }

  return (
    <ParagraphView item={item} blockWidth={block.width}>
      <Text
        paragraphId={item.id}
        text={item.text}
        block={block}
        isRecord={isRecord}
      />
      {!isRecord && item.next && (
        <Button
          size="small"
          type="link"
          onClick={() => onShowNextParagraph(block.id, item.next!.id)}
        >
          {item.next!.type === paragraph.constants.ParagraphType.ADDITIONAL
            ? 'Подробнее'
            : 'Объяснить'}
        </Button>
      )}
    </ParagraphView>
  )
}

export default Paragraph

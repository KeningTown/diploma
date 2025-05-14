import React from 'react'

import { BlockProps } from '../../model'
import { Paragraph, paragraph } from '../../../paragraph'

import BlockView from '../BlockView/BlockView'

type Props = {
  item: BlockProps.ItemAvailable
  isRecord: boolean
}

const Block: React.FC<Props> = ({ item: block, isRecord }) => {
  return (
    <BlockView item={block}>
      {block.paragraphs.map((item) => {
        if (
          item.type !== paragraph.constants.ParagraphType.DEFINITION &&
          !item.visible
        ) {
          return null
        }

        return (
          <Paragraph.Paragraph
            key={item.id}
            item={item}
            block={block}
            isRecord={isRecord}
          />
        )
      })}
    </BlockView>
  )
}

export default Block

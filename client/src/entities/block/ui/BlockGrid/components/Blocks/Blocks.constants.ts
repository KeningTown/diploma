import { BlockProps } from '../../../../model'
import { ParagraphProps, paragraph } from '../../../../../paragraph'

import { id } from '@/services'

export const getInitialBlocks = (
  items: BlockProps.ItemAvailable[]
): BlockProps.ItemAvailable[] => {
  return [...items]
    .sort((a, b) => a.order - b.order)
    .map((item) => {
      const paragraphs = [...item.paragraphs]
        .sort((a, b) => a.order - b.order)
        .map((item, i, items) => {
          if (item.type === paragraph.constants.ParagraphType.DEFINITION) {
            return { ...item, visible: true }
          }

          const visible = item.type === paragraph.constants.ParagraphType.BASIC
          const text =
            typeof item.text === 'string'
              ? item.text
              : item.text.map((token) => {
                  if (typeof token === 'string') {
                    return token
                  }

                  return { ...token, uid: id.getUniqueId() }
                })

          let next: ParagraphProps.ItemNext | undefined

          for (let j = i + 1; j < items.length; j++) {
            const nextItem = items[j]

            if (nextItem.type === paragraph.constants.ParagraphType.BASIC) {
              break
            }

            if (
              nextItem.type !== paragraph.constants.ParagraphType.DEFINITION
            ) {
              next = { id: nextItem.id, type: nextItem.type }
              break
            }
          }

          return { ...item, visible, text, next }
        })

      return { ...item, paragraphs }
    })
}

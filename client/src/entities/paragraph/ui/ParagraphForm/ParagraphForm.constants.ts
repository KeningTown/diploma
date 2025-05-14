import { ParagraphProps, paragraph } from '../../model'

import { Size } from '@/ui/theme'

export const getInitialValues = (
  order: number,
  item?: ParagraphProps.Item | null
): ParagraphProps.CreateData => {
  if (item) {
    return {
      text: item.text,
      type: item.type,
      width: item.width,
      order
    }
  }

  return {
    text: '',
    type: paragraph.constants.ParagraphType.BASIC,
    width: Size.XL,
    order
  }
}

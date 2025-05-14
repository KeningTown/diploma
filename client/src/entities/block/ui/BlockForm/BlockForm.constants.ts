import { BlockProps } from '../../model'

import { Size } from '@/ui/theme'

export const getInitialValues = (
  order: number,
  item?: BlockProps.Item | null
): BlockProps.CreateData => {
  if (item) {
    return {
      title: item.title,
      width: item.width,
      order
    }
  }

  return {
    title: '',
    width: Size.XL,
    order
  }
}

import React, { useCallback } from 'react'

import { AttachmentProps } from '../../model'

import { Size, SIZE } from '@/ui/theme'

import Image from '../Image/Image'

type Props = {
  items: AttachmentProps.Collection
  blockWidth: Size
  paragraphWidth: number
}

const Images: React.FC<Props> = ({ items, blockWidth, paragraphWidth }) => {
  const getWidth = useCallback(
    (i: number) => {
      if (i === 0 && paragraphWidth !== SIZE[Size.XL]) {
        return SIZE[Size.XL] - paragraphWidth
      }

      switch (blockWidth) {
        case Size.XL:
        case Size.L:
          return SIZE[Size.S]
        case Size.M:
          return SIZE[Size.M]
        default:
          return SIZE[Size.XL]
      }
    },
    [blockWidth, paragraphWidth]
  )

  if (!items.length) {
    return null
  }

  return items.map((item, i) => (
    <Image key={item.id} item={item} width={getWidth(i)} />
  ))
}

export default Images

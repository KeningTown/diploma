import React, { useCallback, useMemo } from 'react'

import { ParagraphProps } from '../../model'
import { BlockProps } from '../../../block'

import { useDocumentStore } from '@/store'

import * as Styled from './Token.styled'

type Props = {
  item: ParagraphProps.Token
  block: BlockProps.Item | BlockProps.ItemAvailable
  paragraphId: number | string
  isRecord?: boolean
}

const Token: React.FC<Props> = ({ item, block, paragraphId, isRecord }) => {
  const { terms, onOpenTerm } = useDocumentStore(({ terms, onOpenTerm }) => ({
    terms,
    onOpenTerm
  }))

  const opened = useMemo(() => {
    if (item.id === undefined || !item.d) {
      return true
    }

    return terms.some((term) => {
      return (
        term.blockId === block.id &&
        term.paragraphId === paragraphId &&
        term.termId === item.id
      )
    })
  }, [block.id, item, paragraphId, terms])

  const handleClick = useCallback(() => {
    if (isRecord || opened || item.id === undefined) {
      return
    }

    onOpenTerm(block.id, paragraphId, item.id)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [block.id, item.id, opened, paragraphId])

  const id = useMemo(() => {
    const parts = [
      'word',
      block.id,
      paragraphId,
      item.id ?? 'undefined',
      item.uid
    ]

    return parts.join('___')
  }, [block.id, item.id, item.uid, paragraphId])

  const dataAttrs = useMemo(() => {
    const attrs: Record<string, unknown> = {
      'data-weight': item.f,
      'data-definition': Boolean(item.d)
    }

    if (item.s) {
      attrs['data-synonyms'] = item.s.map(({ id }) => id).join(',')
    }

    if (item.o) {
      attrs['data-origin'] = item.o
    }

    return attrs
  }, [item.d, item.f, item.o, item.s])

  return (
    <>
      {item.l}
      <Styled.Container
        {...dataAttrs}
        id={id}
        $opened={opened}
        onClick={handleClick}
      >
        {item.w}
      </Styled.Container>
      {item.r}
    </>
  )
}

export default Token

import { create } from 'zustand'

import {
  BlockProps,
  paragraph,
  ParagraphProps,
  TermProps,
  record
} from '@/entities'

import { id } from '@/services'

import { WordGazeMap } from '../hooks/useWordGazeMap'

export type Blocks = BlockProps.ItemAvailable[]

type Term = {
  blockId: number
  paragraphId: number | string
  termId: number
}
type Terms = Term[]

type DocumentStore = {
  blocks: Blocks
  terms: Terms
  setBlocks: (cb: Blocks | ((blocks: Blocks) => Blocks)) => void
  setTerms: (cb: Terms | ((terms: Terms) => Terms)) => void
  onShowNextParagraph: (
    blockId: number,
    paragraphId: number,
    understood?: number
  ) => void
  onOpenTerm: (
    blockId: number,
    paragraphId: number | string,
    termId: number
  ) => void
  onUpdateDefinitionTerm: (
    blockId: number,
    paragraphId: string,
    term: TermProps.ItemDefinition
  ) => void
  onUpdateTokens: (
    uid: string,
    termId: number,
    synonymId: number,
    wordGazeMap: WordGazeMap
  ) => void
  clearStore: () => void
}

export const useDocumentStore = create<DocumentStore>((set, get) => {
  const setBlocks: DocumentStore['setBlocks'] = (cb) => {
    set((state) => ({
      ...state,
      blocks: typeof cb === 'function' ? cb(state.blocks) : cb
    }))
  }

  const setTerms: DocumentStore['setTerms'] = (cb) => {
    set((state) => ({
      ...state,
      terms: typeof cb === 'function' ? cb(state.terms) : cb
    }))
  }

  const handleShowNextParagraph = (
    blockId: number,
    paragraphId: number,
    understood?: number
  ) => {
    let pid: number | undefined
    let visible = understood === undefined

    if (understood !== undefined) {
      for (const block of get().blocks) {
        if (block.id !== blockId) {
          continue
        }

        for (const item of block.paragraphs) {
          if (pid === undefined ? item.id !== paragraphId : item.id !== pid) {
            continue
          }

          if (
            pid === undefined &&
            item.type !== paragraph.constants.ParagraphType.DEFINITION &&
            item.next
          ) {
            pid = item.next.id
            continue
          }

          if (item.id === pid) {
            if (
              item.type === paragraph.constants.ParagraphType.ADDITIONAL &&
              understood >= record.constants.GOLDEN_RATIO_GOOD
            ) {
              visible = true
              break
            }

            if (
              item.type === paragraph.constants.ParagraphType.REVEALING &&
              understood < record.constants.GOLDEN_RATIO_BAD
            ) {
              visible = true
              break
            }
          }
        }

        if (pid !== undefined) {
          break
        }
      }
    }

    if (!visible) {
      return
    }

    if (pid === undefined) {
      pid = paragraphId
    }

    setBlocks((blocks) =>
      blocks.map((item) => {
        if (item.id !== blockId) {
          return item
        }

        const paragraphs = item.paragraphs.map((item) => {
          if (item.id !== pid) {
            if (
              item.type !== paragraph.constants.ParagraphType.DEFINITION &&
              item.next?.id === pid &&
              visible
            ) {
              return {
                ...item,
                next: undefined
              }
            }

            return item
          }

          if (
            item.type === paragraph.constants.ParagraphType.DEFINITION ||
            item.visible ||
            !visible
          ) {
            return item
          }

          return { ...item, visible: true }
        })

        return {
          ...item,
          paragraphs
        }
      })
    )
  }

  const handleOpenTerm = (
    blockId: number,
    paragraphId: number | string,
    termId: number
  ) => {
    setBlocks((blocks) =>
      blocks.map((item) => {
        if (item.id !== blockId) {
          return item
        }

        const paragraphs =
          item.paragraphs.reduce<ParagraphProps.CollectionAvailable>(
            (items, item) => {
              items.push(item)

              if (item.id === paragraphId) {
                const uid = id.getUniqueId()

                items.push({
                  id: `${uid}_${termId}`,
                  type: paragraph.constants.ParagraphType.DEFINITION,
                  order: item.order
                })
              }

              return items
            },
            []
          )

        return {
          ...item,
          paragraphs
        }
      })
    )
    setTerms((terms) => {
      return [...terms, { blockId, paragraphId, termId }]
    })
  }

  const handleUpdateDefinitionTerm = (
    blockId: number,
    paragraphId: string,
    term: TermProps.ItemDefinition
  ) => {
    setBlocks((blocks) =>
      blocks.map((item) => {
        if (item.id !== blockId) {
          return item
        }

        const paragraphs = item.paragraphs.map((item) => {
          if (
            item.id !== paragraphId ||
            item.type !== paragraph.constants.ParagraphType.DEFINITION
          ) {
            return item
          }

          const definition = term.definition.map((token) => {
            if (typeof token === 'string') {
              return token
            }

            const uid = id.getUniqueId()

            return { ...token, uid }
          })

          return {
            ...item,
            term: {
              ...term,
              definition
            }
          }
        })

        return {
          ...item,
          paragraphs
        }
      })
    )
    setTerms((terms) => {
      return [...terms, { blockId, paragraphId, termId: term.id }]
    })
  }

  const handleUpdateTokens = (
    uid: string,
    termId: number,
    synonymId: number,
    wordGazeMap: WordGazeMap
  ) => {
    const keys = Object.keys(wordGazeMap).map((key) => key.split('___'))

    setBlocks((blocks) =>
      blocks.map((item) => {
        const paragraphs = item.paragraphs.map((item) => {
          const isDefinition =
            item.type === paragraph.constants.ParagraphType.DEFINITION
          const text = (isDefinition ? item.term?.definition : item.text)?.map(
            (item) => {
              if (
                typeof item === 'string' ||
                item.id !== termId ||
                item.uid === uid ||
                keys.some(
                  (key) => key[3] === String(item.id) && key[4] === item.uid
                )
              ) {
                return item
              }

              const synonym = item.s?.find((item) => item.id === synonymId)

              if (!synonym) {
                return item
              }

              const s = item.s?.filter((item) => item.id !== synonym.id)
              const o = item.o || item.w

              return {
                ...item,
                ...synonym,
                uid: item.uid,
                s,
                o
              }
            }
          )

          if (!text) {
            return item
          }

          if (isDefinition && item.term) {
            // TODO: подставлять синонимы в определение после загрузки
            return { ...item, term: { ...item.term, definition: text } }
          }

          return { ...item, text }
        })

        return { ...item, paragraphs }
      })
    )
  }

  const clearStore = () => {
    setBlocks([])
    setTerms([])
  }

  return {
    blocks: [],
    terms: [],
    setBlocks,
    setTerms,
    onShowNextParagraph: handleShowNextParagraph,
    onOpenTerm: handleOpenTerm,
    onUpdateDefinitionTerm: handleUpdateDefinitionTerm,
    onUpdateTokens: handleUpdateTokens,
    clearStore
  }
})

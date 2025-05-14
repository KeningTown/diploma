import React, { useCallback, useRef, useState } from 'react'
import useResizeObserver from '@react-hook/resize-observer'

import { BlockProps } from '../../model'
import { Record, RecordProps } from '../../../record'

import { useWordGazeMap, Box, Words } from '@/hooks/useWordGazeMap'
import { useTrackerSettings } from '@/hooks/useTrackerSettings'

import BlockGridView from '../BlockGridView/BlockGridView'
import { Blocks } from './components'

type WordDataset = {
  weight?: string
  synonyms?: string
  definition?: string
  origin?: string
}

type Props = {
  documentId?: number
  items: BlockProps.ItemAvailable[]
  width?: number
  documentResult?: RecordProps.Result
  documentGazes?: RecordProps.Gazes
}

const BlockGrid: React.FC<Props> = ({
  documentId,
  items,
  width,
  documentResult,
  documentGazes
}) => {
  const container = useRef<HTMLDivElement>(null)

  const isRecord = width !== undefined

  const [size, setSize] = useState<Box>({
    x: 0,
    y: 0,
    width: 0,
    height: 0
  })
  const [words, setWords] = useState<Words>([])

  const {
    result,
    gazes,
    synonyms,
    addWordGaze,
    setWordValue,
    getWordValue,
    addGaze
  } = useWordGazeMap({
    documentResult,
    documentGazes,
    words
  })

  const updateWords = useCallback(
    (target: Element | null = container.current) => {
      if (!target) {
        return
      }

      const targetRect = target.getBoundingClientRect()
      const words = [...target.querySelectorAll('[id^="word"]')].map((item) => {
        const rect = item.getBoundingClientRect()
        const [, blockId, paragraphId, termId, uid] = item.id.split('___')

        const dataset = (item as { dataset?: WordDataset }).dataset
        const weight = Number(dataset?.weight) || 0
        const synonyms = dataset?.synonyms?.split(',').map(Number)
        const hasDefinition = dataset?.definition === 'true'
        const origin = dataset?.origin

        return {
          id: item.id,
          uid,
          x: rect.x - targetRect.x,
          y: rect.y - targetRect.y,
          width: rect.width,
          height: rect.height,
          blockId: Number(blockId),
          paragraphId: Number(paragraphId) || paragraphId,
          termId: termId === 'undefined' ? undefined : Number(termId),
          value: item.textContent || '',
          weight,
          synonyms,
          hasDefinition,
          origin
        }
      })

      setWords(words)
      setSize({
        x: Math.abs(targetRect.x),
        y: Math.abs(targetRect.y),
        width: targetRect.width,
        height: targetRect.height
      })
    },
    []
  )

  useResizeObserver(container, (entry) => {
    updateWords(entry.target)
  })

  const trackerSettings = useTrackerSettings()

  return (
    <BlockGridView ref={container} width={width}>
      <Blocks
        {...trackerSettings}
        isRecord={isRecord}
        documentId={documentId}
        width={size.width}
        result={result}
        gazes={gazes}
        synonyms={synonyms}
        items={items}
        updateWords={updateWords}
      />
      <Record.Layout
        {...trackerSettings}
        isRecord={isRecord}
        size={size}
        words={words}
        gazes={gazes}
        addWordGaze={addWordGaze}
        setWordValue={setWordValue}
        getWordValue={getWordValue}
        addGaze={addGaze}
      />
    </BlockGridView>
  )
}

export default BlockGrid

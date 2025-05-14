import { useRef, useCallback, useEffect } from 'react'

import { RecordProps, record } from '@/entities'

import { Words, Word, WordGazeMap } from './useWordGazeMap.types'

import { useDocumentStore } from '@/store'

const MIN_CURSOR = 2
const MAX_CURSOR = 8

const MIN_GAZE = 1
const MAX_GAZE = 5

type Props = {
  documentResult?: RecordProps.Result
  documentGazes?: RecordProps.Gazes
  words: Words
}

export const useWordGazeMap = ({
  documentResult = {},
  documentGazes = [],
  words
}: Props) => {
  const { onShowNextParagraph, onUpdateTokens } = useDocumentStore(
    ({ onShowNextParagraph, onUpdateTokens }) => ({
      onShowNextParagraph,
      onUpdateTokens
    })
  )

  const wordGazeMap = useRef<WordGazeMap>({})
  const result = useRef(documentResult)
  const gazes = useRef(documentGazes)
  const synonyms = useRef<RecordProps.Synonyms>({})

  useEffect(() => {
    words.forEach((word) => {
      if (!result.current[word.blockId]) {
        result.current[word.blockId] = {}
      }

      if (!result.current[word.blockId][word.paragraphId]) {
        result.current[word.blockId][word.paragraphId] = {
          read: 0,
          understood: 0,
          words: {}
        }
      }

      result.current[word.blockId][word.paragraphId].words[word.id] =
        result.current[word.blockId][word.paragraphId].words[word.id] || 0
    })
  }, [words])

  const addWordGaze = useCallback((word: Word, value = 1) => {
    if (!wordGazeMap.current[word.id]) {
      wordGazeMap.current[word.id] = 0
    }

    wordGazeMap.current[word.id] += value
  }, [])

  const calcParagraphResult = useCallback(
    (blockId: number, paragraphId: number | string) => {
      const paragraph = result.current[blockId][paragraphId]

      let readMax = 0
      let read = 0

      let understoodMax = 0
      let understoodMin = 0
      let understood = 0

      for (const id in paragraph.words) {
        const word = words.find((word) => word.id === id)

        if (!word) {
          continue
        }

        readMax += word.value.length

        const value = paragraph.words[id]

        if (value > record.constants.WORD_VALUE.UNREAD) {
          read += word.value.length

          understoodMax += record.constants.WORD_VALUE.CLEAR * word.weight
          understoodMin += record.constants.WORD_VALUE.UNCLEAR * word.weight
          understood += value * word.weight
        }
      }

      paragraph.read = read / readMax
      paragraph.understood =
        understoodMax > 0
          ? 1 - (understoodMax - understood) / (understoodMax - understoodMin)
          : 0

      return paragraph
    },
    [words]
  )

  const setWordValue = useCallback(
    (word: Word, isCursor: boolean) => {
      if (!result.current[word.blockId]?.[word.paragraphId]) {
        return
      }

      const MIN = isCursor ? MIN_CURSOR : MIN_GAZE
      const MAX = isCursor ? MAX_CURSOR : MAX_GAZE

      const min = word.value.length * MIN
      const max = word.value.length * MAX
      const data = wordGazeMap.current[word.id] || 0

      let value: number = record.constants.WORD_VALUE.UNREAD

      if (data >= min) {
        if (data < max) {
          value = record.constants.WORD_VALUE.CLEAR
        } else {
          value = record.constants.WORD_VALUE.UNCLEAR
        }
      }

      result.current[word.blockId][word.paragraphId].words[word.id] = value

      if (
        word.termId &&
        value === record.constants.WORD_VALUE.UNCLEAR &&
        word.synonyms &&
        !synonyms.current[word.termId]
      ) {
        const synonymId = word.synonyms[0]

        synonyms.current[word.termId] = synonymId

        onUpdateTokens(word.uid, word.termId, synonymId, wordGazeMap.current)
      }

      const { read, understood } = calcParagraphResult(
        word.blockId,
        word.paragraphId
      )

      if (
        typeof word.paragraphId !== 'string' &&
        read >= record.constants.GOLDEN_RATIO_GOOD
      ) {
        // TODO: при раскрытии абзаца или определения, смещать все gazes, которые находятся ниже текущего указателя, вниз на высоту абзаца или определения (можно взять разницу между предыдущей и новой высотой контейнера)
        onShowNextParagraph(word.blockId, word.paragraphId, understood)
      }

      return value
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [calcParagraphResult]
  )

  const getWordValue = useCallback((word: Word) => {
    return result.current[word.blockId]?.[word.paragraphId]?.words[word.id]
  }, [])

  const addGaze = useCallback(
    (gaze: { x: number; y: number }, radius: number) => {
      const prevGaze = gazes.current[gazes.current.length - 1]

      if (!prevGaze) {
        gazes.current.push([gaze.x, gaze.y, 1])
        return
      }

      const dx = prevGaze[0] - gaze.x
      const dy = prevGaze[1] - gaze.y
      const d = Math.sqrt(dx * dx + dy * dy)

      if (d > radius) {
        gazes.current.push([gaze.x, gaze.y, 1])
      } else {
        prevGaze[2]++
      }
    },
    []
  )

  return {
    wordGazeMap: wordGazeMap.current,
    result: result.current,
    gazes: gazes.current,
    synonyms: synonyms.current,
    addWordGaze,
    setWordValue,
    getWordValue,
    addGaze
  }
}

export type UseWordGazeMap = ReturnType<typeof useWordGazeMap>

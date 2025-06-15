import React, { useMemo, useState, useEffect, useRef, useCallback } from 'react'
import { Stage, Layer, Rect, Circle, Label, Tag, Text } from 'react-konva'
import Konva from 'konva'

import { record } from '../../../record'

import { Pointer } from './Layout.types'

import {
  NO_INDEX,
  SHOW_WORDS,
  SHOW_CIRCLE,
  DEFAULT_RADIUS,
  RADIUS_RATIO,
  RADIUS_GRADIENT,
  CIRCLE_GRADIENT,
  DEFAULT_POINTER
} from './Layout.constants'

import {
  getPointer,
  getWordColor,
  getWordStroke,
  pointerWordDistance,
  scrollPage
} from './Layout.helpers'

import { useDocumentStore } from '@/store'

import { Box, Words, UseWordGazeMap } from '@/hooks/useWordGazeMap'
import { UseTrackerSettings } from '@/hooks/useTrackerSettings'
import { useHeatMap } from './hooks/useHeatMap'
import { useSettings } from './hooks/useSettings'

import { Settings, GazeMap } from './components'

import * as Styled from './Layout.styled'

type Props = {
  isRecord: boolean
  size: Box
  words: Words
  gazes: UseWordGazeMap['gazes']
  addWordGaze: UseWordGazeMap['addWordGaze']
  setWordValue: UseWordGazeMap['setWordValue']
  getWordValue: UseWordGazeMap['getWordValue']
  addGaze: UseWordGazeMap['addGaze']
} & UseTrackerSettings

const Layout: React.FC<Props> = ({
  isRecord,
  size,
  words,
  gazes,
  trackerSettings,
  trackerSettingsOpened,
  addWordGaze,
  setWordValue,
  getWordValue,
  addGaze
}) => {
  const { terms, onOpenTerm } = useDocumentStore(({ terms, onOpenTerm }) => ({
    terms,
    onOpenTerm
  }))

  const [isCursor, setIsCursor] = useState(false)

  const stage = useRef<Konva.Stage>(null)

  const { settings, onChangeSetting } = useSettings()

  const { createHeatMap } = useHeatMap(settings.heatMap)

  useEffect(() => {
    const container = stage.current?.content

    if (isRecord && container && size.width) {
      createHeatMap(container, gazes)
    }
  }, [createHeatMap, gazes, isRecord, size.width])

  const [pointer, setPointer] = useState(DEFAULT_POINTER)

  const radius = (words[0]?.height || DEFAULT_RADIUS) * RADIUS_RATIO

  const changePointer = useCallback(
    (gaze?: Pointer, isMouse = false) => {
      if (!gaze) {
        return
      }

      setIsCursor(isMouse)
      setPointer(gaze)
      !isRecord && addGaze(gaze, radius)
    },
    [addGaze, isRecord, radius]
  )

  useEffect(() => {
    if (
      isRecord ? false : !trackerSettings.trackMouse || trackerSettingsOpened
    ) {
      return
    }

    const mouseMoveListener = (e: MouseEvent) => {
      changePointer(getPointer(stage, e), true)
    }

    window.addEventListener('mousemove', mouseMoveListener)

    return () => {
      window.removeEventListener('mousemove', mouseMoveListener)
    }
  }, [
    changePointer,
    isRecord,
    trackerSettings.trackMouse,
    trackerSettingsOpened
  ])

  useEffect(() => {
    if (isRecord || trackerSettingsOpened) {
      return
    }

    window.faceControls.screen.setDiagonal(trackerSettings.screenDiagonal)

    window.faceControls.setOnGaze((x, y) => {
      if (!trackerSettings.trackGaze) {
        return
      }

      changePointer(getPointer(stage, { x, y }))
    })

    if (!trackerSettings.trackGaze) {
      window.faceControls.stop()
      return
    }
    window.faceControls
      .init(
        'faceContainer', 
        '/landmarker', 
        '/landmarker/face_landmarker.task'
      )
      .then(async () => {
        window.faceControls.setIntrinsicParams({
          focalLength:{
            x: trackerSettings.xFocalLength,
            y: trackerSettings.yFocalLength
          },
          principlePoint: {
            x: trackerSettings.xPrinciplePoint,
            y: trackerSettings.yPrinciplePoint
          }
        })

        await window.faceControls.startPredictionLoop()
        window.faceControls.camera.setDiagonalFov(trackerSettings.diagonalFov)
      })
  }, [
    changePointer,
    isRecord,
    trackerSettings.diagonalFov,
    trackerSettings.screenDiagonal,
    trackerSettings.trackGaze,
    trackerSettingsOpened
  ])

  useEffect(() => {
    return () => {
      window.faceControls.stop()
    }
  }, [])

  const current = useMemo(() => {
    let i = NO_INDEX
    let min = radius

    words.forEach((word, j) => {
      const d = pointerWordDistance(pointer, radius, word)

      if (d !== undefined && d < min) {
        min = d
        i = j
      }
    })

    if (i === NO_INDEX) {
      return null
    }

    return {
      word: words[i],
      value: 1 - min / radius
    }
  }, [pointer, radius, words])

  useEffect(() => {
    if (isRecord || !current) {
      return
    }

    addWordGaze(current.word, current.value)

    const value = setWordValue(current.word, isCursor)

    if (
      !current.word.termId ||
      !current.word.hasDefinition ||
      value !== record.constants.WORD_VALUE.UNCLEAR
    ) {
      return
    }

    const opened = terms.some((term) => {
      return (
        term.blockId === current.word.blockId &&
        term.paragraphId === current.word.paragraphId &&
        term.termId === current.word.termId
      )
    })

    if (!opened) {
      onOpenTerm(
        current.word.blockId,
        current.word.paragraphId,
        current.word.termId
      )
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [terms, current, words, pointer, isCursor])

  useEffect(() => {
    if (!trackerSettings.autoScroll || trackerSettingsOpened) {
      return
    }

    scrollPage(stage, pointer, trackerSettings.autoScrollSpeed)
  }, [pointer, trackerSettings, trackerSettingsOpened])

  const showWords = isRecord || SHOW_WORDS
  const showCircle = isRecord ? false : trackerSettings.trackGaze || SHOW_CIRCLE

  return (
    <>
      <Styled.Container
        as={Stage}
        ref={stage}
        width={size.width}
        height={size.height}
      >
        <Layer listening={false}>
          {showWords &&
            words.map((word) => {
              const value = getWordValue(word)
              const fill = getWordColor(value) + '33'
              const isCurrent = isRecord ? false : word.id === current?.word.id
              const stroke = getWordStroke(isCurrent, word)

              return (
                <Rect
                  key={word.id}
                  x={word.x}
                  y={word.y}
                  width={word.width}
                  height={word.height}
                  fill={fill}
                  stroke={stroke}
                  strokeWidth={2}
                />
              )
            })}
          {isRecord && settings.gazeMap && <GazeMap gazes={gazes} />}
          {showCircle && (
            <Circle
              x={pointer.x}
              y={pointer.y}
              radius={radius * RADIUS_GRADIENT}
              fillRadialGradientStartRadius={radius * RADIUS_GRADIENT}
              fillRadialGradientEndRadius={radius}
              fillRadialGradientColorStops={CIRCLE_GRADIENT}
            />
          )}
          {isRecord &&
            words.map((word) => {
              if (!word.origin) {
                return null
              }

              const isCurrent = word.id === current?.word.id

              if (!isCurrent) {
                return null
              }

              return (
                <Label key={word.id} x={word.x + word.width / 2} y={word.y}>
                  <Tag
                    fill="black"
                    cornerRadius={4}
                    pointerDirection="down"
                    pointerWidth={8}
                    pointerHeight={4}
                  />
                  <Text
                    text={word.origin}
                    fontSize={14}
                    padding={4}
                    fontFamily="Inter"
                    verticalAlign="middle"
                    fill="white"
                  />
                </Label>
              )
            })}
        </Layer>
      </Styled.Container>
      {isRecord && <Settings state={settings} onChange={onChangeSetting} />}
    </>
  )
}

export default Layout

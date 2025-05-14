import React from 'react'
import Konva from 'konva'

import { record } from '../../model'

import { Pointer } from './Layout.types'

import { SCROLL_TOP, SHOW_CURRENT_WORD } from './Layout.constants'

import { Box, Word } from '@/hooks/useWordGazeMap'
import {
  AutoScrollSpeed,
  AUTO_SCROLL_SPEED_VALUE
} from '@/hooks/useTrackerSettings'

import { theme } from '@/ui/theme'

export const getPointer = (
  stage: React.RefObject<Konva.Stage>,
  coords: Pointer
) => {
  const rect = stage.current?.content.getBoundingClientRect()

  if (!rect) {
    return coords
  }

  if (
    coords.x > rect.x &&
    coords.x < rect.x + rect.width &&
    coords.y > rect.y &&
    coords.y < rect.y + rect.height
  ) {
    const x = coords.x - rect.x
    const y = coords.y - rect.y

    return { x, y }
  }

  return undefined
}

const getPageY = (stage: React.RefObject<Konva.Stage>, coords: Pointer) => {
  const rect = stage.current?.content.getBoundingClientRect()

  return coords.y + (rect?.y || 0)
}

export const scrollPage = (
  stage: React.RefObject<Konva.Stage>,
  coords: Pointer,
  autoScrollSpeed: AutoScrollSpeed
) => {
  const speed = AUTO_SCROLL_SPEED_VALUE[autoScrollSpeed]
  const pageY = getPageY(stage, coords)
  const pageRatio = pageY / window.innerHeight
  const delta =
    pageRatio > SCROLL_TOP
      ? ((pageRatio - SCROLL_TOP) / (1 - SCROLL_TOP)) * speed
      : (SCROLL_TOP - pageRatio) * -speed
  const top = window.scrollY + Math.round(delta)

  window.scroll({
    behavior: 'smooth',
    top
  })
}

export const getWordColor = (value: number) => {
  switch (value) {
    case record.constants.WORD_VALUE.CLEAR:
      return theme.palette.green[5]
    case record.constants.WORD_VALUE.UNCLEAR:
      return theme.palette.red[5]
    default:
      return theme.palette.gray[5]
  }
}

export const getWordStroke = (isCurrent: boolean, word?: Word) => {
  if (SHOW_CURRENT_WORD && isCurrent) {
    return 'black'
  }

  if (word?.origin) {
    return theme.palette.purple[5]
  }

  return undefined
}

export const pointerWordDistance = (
  pointer: Pointer,
  radius: number,
  word: Box
) => {
  const minX = word.x
  const maxX = word.x + word.width

  const minY = word.y
  const maxY = word.y + word.height

  if (
    pointer.x >= minX &&
    pointer.x <= maxX &&
    pointer.y >= minY &&
    pointer.y <= maxY
  ) {
    return 0
  }

  let x = pointer.x
  let y = pointer.y

  if (pointer.x < minX) {
    x = minX
  } else if (pointer.x > maxX) {
    x = maxX
  }

  if (pointer.y < minY) {
    y = minY
  } else if (pointer.y > maxY) {
    y = maxY
  }

  const dx = pointer.x - x
  const dy = pointer.y - y
  const d = Math.sqrt(dx * dx + dy * dy)

  if (d <= radius) {
    return d
  }

  return undefined
}

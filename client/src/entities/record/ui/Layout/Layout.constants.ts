import { Pointer } from './Layout.types'

export const NO_INDEX = -1

// debug
export const SHOW_WORDS = false
export const SHOW_CURRENT_WORD = false
export const SHOW_CIRCLE = false

export const DEFAULT_RADIUS = 14
export const RADIUS_RATIO = 2
export const RADIUS_GRADIENT = 1.4
export const CIRCLE_GRADIENT = [
  0,
  'transparent',
  1,
  'rgba(0, 0, 0, 0.05)',
  1,
  'transparent'
]

export const SCROLL_TOP = 0.2

export const DEFAULT_POINTER: Pointer = { x: -1000, y: -1000 }

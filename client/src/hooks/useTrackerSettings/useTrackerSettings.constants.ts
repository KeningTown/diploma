import {
  AutoScrollSpeed,
  TrackerSettingsState
} from './useTrackerSettings.types'

export const DEFAULT_STATE: TrackerSettingsState = {
  trackMouse: true,
  trackGaze: false,
  screenDiagonal: 16,
  diagonalFov: 80,
  autoScroll: false,
  autoScrollSpeed: AutoScrollSpeed.MEDIUM
}

export const AUTO_SCROLL_SPEED_VALUE = {
  [AutoScrollSpeed.LOW]: 5,
  [AutoScrollSpeed.MEDIUM]: 10,
  [AutoScrollSpeed.HIGH]: 30
} as const

export const AUTO_SCROLL_SPEED_RU = {
  [AutoScrollSpeed.LOW]: 'Низкая',
  [AutoScrollSpeed.MEDIUM]: 'Средняя',
  [AutoScrollSpeed.HIGH]: 'Высокая'
} as const

export const LOCAL_STORAGE_KEY = 'TRACKER_SETTINGS'

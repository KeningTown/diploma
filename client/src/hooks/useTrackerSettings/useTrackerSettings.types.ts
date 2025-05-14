export enum AutoScrollSpeed {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH'
}

export type TrackerSettingsState = {
  trackMouse: boolean
  trackGaze: boolean
  screenDiagonal: number
  diagonalFov: number
  autoScroll: boolean
  autoScrollSpeed: AutoScrollSpeed
}

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
  xFocalLength: number
  yFocalLength: number
  xPrinciplePoint: number
  yPrinciplePoint: number
  autoScroll: boolean
  autoScrollSpeed: AutoScrollSpeed
  isTrained: boolean
}

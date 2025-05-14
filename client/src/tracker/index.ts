import { FaceControls as FC } from './FaceControls/FaceControls'

declare global {
  type FaceControls = FC
}

window.faceControls = new FC()

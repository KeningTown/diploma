import { Vector3 } from 'three'

import { SCREEN_HALF_WIDTH, SCREEN_HALF_HEIGHT } from '../constants'

import { getPpMm } from './FaceScreen.helpers'

export class FaceScreen {
  diagonal = 0
  viewport = new Vector3(window.screenLeft, window.screenTop)
  center = new Vector3()
  halfScale = new Vector3()
  halfScaleReal = new Vector3()

  setDiagonal(value: number) {
    this.diagonal = value

    const ppMm = getPpMm(this.diagonal)

    this.halfScaleReal.setX(SCREEN_HALF_WIDTH / ppMm)
    this.halfScaleReal.setY(SCREEN_HALF_HEIGHT / ppMm)
  }

  setViewport(e: MouseEvent) {
    this.viewport.setX(e.screenX - e.clientX)
    this.viewport.setY(e.screenY - e.clientY)
  }

  addEvent() {
    window.addEventListener('mousemove', this.setViewport.bind(this))
  }

  removeEvent() {
    window.removeEventListener('mousemove', this.setViewport.bind(this))
  }
}

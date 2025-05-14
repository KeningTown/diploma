import { Vector3 } from 'three'
import { KalmanFilter, KalmanState } from 'kalman-filter'

import {
  DEFAULT_SCREEN_DIAGONAL,
  DEFAULT_DIAGONAL_FOV,
  DEFAULT_IRIS_WIDTH,
  SCREEN_HALF_WIDTH,
  SCREEN_HALF_HEIGHT
} from '../constants'
import { KALMAN_FILTER_OPTIONS } from './FaceControls.constants'
import {
  WASM_PATH,
  MODEL_ASSET_PATH
} from '../FaceTracker/FaceTracker.constants'

import { FaceScreen } from '../FaceScreen/FaceScreen'
import { FaceCamera } from '../FaceCamera/FaceCamera'
import { FaceTracker } from '../FaceTracker/FaceTracker'

type HandleGaze = (x: number, y: number) => void

export class FaceControls {
  initialized = false
  started = false
  container: HTMLDivElement | undefined
  screen: FaceScreen
  camera: FaceCamera
  tracker: FaceTracker
  irisWidth = DEFAULT_IRIS_WIDTH
  animation: number | undefined

  target = new Vector3()
  kalman = new KalmanFilter(KALMAN_FILTER_OPTIONS)
  kalmanState: KalmanState

  onGaze: HandleGaze = () => undefined

  constructor() {
    this.screen = new FaceScreen()
    this.camera = new FaceCamera()
    this.tracker = new FaceTracker()
  }

  async init(
    containerId: string,
    wasmPath = WASM_PATH,
    modelAssetPath = MODEL_ASSET_PATH
  ) {
    if (this.initialized) {
      return
    }

    this.initialized = true
    this.container = document.createElement('div')
    this.container.id = containerId

    document.body.appendChild(this.container)

    await this.camera.init(this.container)
    await this.tracker.init(wasmPath, modelAssetPath)
  }

  setIrisWidth(value: number) {
    this.irisWidth = value
  }

  setOnGaze(onGaze: HandleGaze) {
    this.onGaze = onGaze
  }

  async start() {
    if (this.started || this.animation !== undefined) {
      return
    }

    this.started = true

    if (this.screen.diagonal === 0) {
      this.screen.setDiagonal(DEFAULT_SCREEN_DIAGONAL)
    }

    this.screen.addEvent()
    await this.camera.start()

    if (this.camera.diagonalFov === 0) {
      this.camera.setDiagonalFov(DEFAULT_DIAGONAL_FOV)
    }

    this.loop()
  }

  stop() {
    if (!this.started || !this.animation) {
      return
    }

    this.started = false

    this.screen.removeEvent()
    this.camera.stop()

    cancelAnimationFrame(this.animation)

    this.animation = undefined
  }

  loop() {
    this.tracker.update(this.camera)

    const irisRatio = this.tracker.irisWidthInPx / this.irisWidth

    this.screen.halfScale
      .copy(this.screen.halfScaleReal)
      .multiplyScalar(irisRatio)

    this.screen.center.setY(-this.screen.halfScale.y)

    this.target
      .copy(this.tracker.intersection)
      .sub(this.screen.center)
      .divide(this.screen.halfScale)

    if (!isNaN(this.target.x)) {
      this.target.setX((1 - this.target.x) * SCREEN_HALF_WIDTH)
      this.target.setY((1 - this.target.y) * SCREEN_HALF_HEIGHT)
      this.target.sub(this.screen.viewport)

      this.kalmanState = this.kalman.filter({
        previousCorrected: this.kalmanState,
        observation: [this.target.x, this.target.y]
      })

      const { mean } = this.kalmanState

      this.target.setX(mean[0][0])
      this.target.setY(mean[1][0])

      this.onGaze(this.target.x, this.target.y)
    }

    this.animation = requestAnimationFrame(() => this.loop())
  }
}

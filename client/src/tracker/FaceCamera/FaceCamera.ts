import { Plane, Vector3 } from 'three'

import { CONSTRAINTS } from './FaceCamera.constants'

import { getHypot, degToRad } from '../helpers'
import { getFocalLength } from './FaceCamera.helpers'

export class FaceCamera {
  video: HTMLVideoElement | undefined
  stream: MediaStream | undefined
  width = 0
  height = 0
  aspectRatio = 0
  diagonal = 0
  diagonalFov = 0
  focalLength = 0
  plane = new Plane(new Vector3(0, 0, -1))

  setDiagonalFov(value: number) {
    this.diagonalFov = degToRad(value)
    this.focalLength = getFocalLength(this.diagonal, this.diagonalFov)
    this.plane.constant = this.focalLength
  }

  async init(container: HTMLElement) {
    if (this.video) {
      return
    }

    this.video = document.createElement('video')

    container.appendChild(this.video)
  }

  async start() {
    if (!this.video) {
      return
    }

    this.stream = await navigator.mediaDevices.getUserMedia(CONSTRAINTS)
    this.video.srcObject = this.stream

    await this.video.play()

    this.width = this.video.videoWidth
    this.height = this.video.videoHeight
    this.aspectRatio = this.width / this.height
    this.diagonal = getHypot(this.width, this.height)
  }

  stop() {
    if (!this.video || !this.stream) {
      return
    }

    this.stream.getVideoTracks()[0].stop()

    this.video.src = ''
  }
}

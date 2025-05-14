import { FilesetResolver, FaceLandmarker } from '@mediapipe/tasks-vision'
import { Matrix4, Vector3, Ray } from 'three'

import { POINTS_NUMBER, POINTS } from './FaceTracker.constants'

import { getIrisWidthInPx } from './FaceTracker.helpers'

import { FaceCamera } from '../FaceCamera/FaceCamera'

export class FaceTracker {
  landmarker: FaceLandmarker | undefined
  points = Array.from({ length: POINTS_NUMBER }, () => new Vector3())
  transform = new Matrix4()
  direction = new Vector3()
  irisWidthInPx = 0
  ray = new Ray()
  intersection = new Vector3()

  gaze = new Ray()
  intersection2 = new Vector3()

  async init(wasmPath: string, modelAssetPath: string) {
    if (this.landmarker) {
      return
    }

    const wasmFileset = await FilesetResolver.forVisionTasks(wasmPath)

    this.landmarker = await FaceLandmarker.createFromOptions(wasmFileset, {
      baseOptions: {
        modelAssetPath,
        delegate: 'GPU'
      },
      runningMode: 'VIDEO',
      numFaces: 1,
      outputFacialTransformationMatrixes: true,
      outputFaceBlendshapes: false
    })
  }

  update(camera: FaceCamera) {
    if (!camera.video || !this.landmarker) {
      return
    }

    const {
      faceLandmarks: [landmarks],
      facialTransformationMatrixes: [transformationMatrix]
    } = this.landmarker.detectForVideo(camera.video, performance.now())

    if (!landmarks) return

    landmarks.forEach(({ x, y, z }, i) => {
      this.points[i].set(
        (x - 0.5) * camera.width,
        (y - 0.5) * -camera.height,
        z * -camera.width
      )
    })

    this.transform.fromArray(transformationMatrix.data)
    this.direction.setFromMatrixColumn(this.transform, 2)

    const middle = this.points[POINTS.BETWEEN_EYES]

    this.ray.set(middle, this.direction)
    this.ray.intersectPlane(camera.plane, this.intersection)

    this.irisWidthInPx = getIrisWidthInPx(this.points)
  }
}

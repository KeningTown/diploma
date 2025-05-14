import { Vector3 } from 'three'

import { POINTS } from './FaceTracker.constants'

export const getIrisWidthInPx = (points: Vector3[]) => {
  const rightIrisWidth = points[POINTS.RIGHT_IRIS_LEFT].distanceTo(
    points[POINTS.RIGHT_IRIS_RIGHT]
  )
  const leftIrisWidth = points[POINTS.LEFT_IRIS_LEFT].distanceTo(
    points[POINTS.LEFT_IRIS_RIGHT]
  )

  return (rightIrisWidth + leftIrisWidth) / 2
}

/* eslint-disable @typescript-eslint/no-explicit-any */
declare module 'kalman-filter' {
  type KalmanState = any
  type KalmanOptions = {
    observation: {
      name: string
      sensorDimension: number
    }
    dynamic: {
      name: string
      covariance: number[]
    }
  }
  type KalmanFilterOptions = any

  class KalmanFilter {
    constructor(options: KalmanOptions): KalmanFilter
    filter(options: KalmanFilterOptions): KalmanState
  }

  export { KalmanFilter, KalmanState }
}

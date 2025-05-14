export const KALMAN_FILTER_OPTIONS = {
  observation: {
    name: 'sensor',
    sensorDimension: 2
  },
  dynamic: {
    name: 'constant-position',
    // covariance: [0.005, 0.005]
    covariance: [0.05, 0.05]
  }
}

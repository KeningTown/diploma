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
export const REGRESSION_MODEL_WEIGTHS_LOCAL_STORAGE_KEY = "gaze_prediction_reggresion_weigths"

export const GAZE_PREDICTION_MODEL_PATH = "/gazePredictionModel/model.json"
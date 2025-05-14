export const WASM_PATH =
  'https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@latest/wasm'

export const MODEL_ASSET_PATH =
  'https://storage.googleapis.com/mediapipe-models/face_landmarker/face_landmarker/float16/latest/face_landmarker.task'

export const POINTS_NUMBER = 468 + 10

export const POINTS = {
  // BETWEEN_EYES: 6,
  BETWEEN_EYES: 168,
  RIGHT_IRIS_LEFT: 469,
  RIGHT_IRIS_RIGHT: 471,
  LEFT_IRIS_LEFT: 474,
  LEFT_IRIS_RIGHT: 476
} as const

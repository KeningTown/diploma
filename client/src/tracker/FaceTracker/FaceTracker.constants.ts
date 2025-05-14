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
  LEFT_IRIS_RIGHT: 476,
  MOUTH_CENTER: 13,
  RIGHT_EYE_BORDER: [246, 161, 160, 159, 158, 157, 173, 133, 155, 154, 153, 145, 144, 163, 7, 33],
  LEFT_EYE_BORDER: [362, 398, 384, 385, 386, 387, 388, 466, 263, 249, 390, 373, 374, 380, 381, 382]
} as const

// Межзрачковое расстояние для определения расстояния между пользователем и камерой
export const IPD_MM = 63 
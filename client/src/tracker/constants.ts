export const DEFAULT_SCREEN_DIAGONAL = 16
export const DEFAULT_DIAGONAL_FOV = 80
export const DEFAULT_IRIS_WIDTH = 12

export const SCREEN_HALF_WIDTH = window.screen.width / 2
export const SCREEN_HALF_HEIGHT = window.screen.height / 2

// Внутренние параметры нормализованной камеры
export const NORMALIZED_CAMERA_PARAMS = {
    INTRINSIC_PARAMS:{
        xFocalLengthInMM: 950,
        yFocalLengthInMM: 950,
        PrincipalPoint:{
            x: 475,
            y: 475
        }
    },
    USER_TO_CAMERA_DISTANCE: 600
}
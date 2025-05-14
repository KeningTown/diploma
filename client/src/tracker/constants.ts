export const DEFAULT_SCREEN_DIAGONAL = 16
export const DEFAULT_DIAGONAL_FOV = 80
export const DEFAULT_IRIS_WIDTH = 12

export const SCREEN_HALF_WIDTH = window.screen.width / 2
export const SCREEN_HALF_HEIGHT = window.screen.height / 2

// Внутренние параметры исходной камеры устройства на котором работает система.
// Для определения значений требуется откалибровать камеру. 
// Для калибровки можно использовать алгоритм шахматной доски, подробнее см. тут:
// https://longervision.github.io/2017/03/16/ComputerVision/OpenCV/opencv-internal-calibration-chessboard/
export const CAMERA_PARAMS = {
    INTRINSIC_PARAMS:{
        xFocalLengthInMM: 1070,
        yFocalLengthInMM: 1070,
        PrincipalPoint:{
            x: 535,
            y: 535
        }
    }
}

// Внутренние параметры нормализованной камеры
export const NORMALIZED_CAMERA_PARAMS = {
    INTRINSIC_PARAMS:{
        xFocalLengthInMM: 600,
        yFocalLengthInMM: 600,
        PrincipalPoint:{
            x: 400,
            y: 400
        }
    },
    distance: 300
}
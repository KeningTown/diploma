export const CONSTRAINTS = {
  video: {
    // facingMode: { exact: 'user' },
    width: { ideal: 4096 },
    height: { ideal: 2160 }
  }
}

// Внутренние параметры исходной камеры устройства на котором работает система.
// Для определения значений требуется откалибровать камеру. 
// Для калибровки можно использовать алгоритм шахматной доски, подробнее см. тут:
// https://longervision.github.io/2017/03/16/ComputerVision/OpenCV/opencv-internal-calibration-chessboard/
export const CAMERA_PARAMS = {
    INTRINSIC_PARAMS:{
        xFocalLengthInPx: 950,
        yFocalLengthInPx: 950,
        PrincipalPoint:{
            x: 475,
            y: 475
        }
    }
}

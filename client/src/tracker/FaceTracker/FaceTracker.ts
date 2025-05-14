import { FilesetResolver, FaceLandmarker } from '@mediapipe/tasks-vision'
import { Matrix4, Vector3, Ray } from 'three'

import { POINTS_NUMBER, POINTS, IPD_MM } from './FaceTracker.constants'

import { getIrisWidthInPx } from './FaceTracker.helpers'

import { FaceCamera } from '../FaceCamera/FaceCamera'

import {CAMERA_PARAMS, NORMALIZED_CAMERA_PARAMS} from '../constants'

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

    // Дополнительные canvas под отладку
    public leftEyeCanvas?: HTMLCanvasElement;
    public rightEyeCanvas?: HTMLCanvasElement;
  
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

      // создаём скрытый canvas
      this.hiddenCanvas = document.createElement('canvas');
      this.hiddenCanvas.width  = 640;  // или camera.width, если известна заранее
      this.hiddenCanvas.height = 480;  // или camera.height
      this.ctx = this.hiddenCanvas.getContext('2d')!;    
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

    // Вероятно придется поменять, но мб и нет
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

    this.ctx.clearRect(0, 0, camera.width, camera.height);
    this.ctx.drawImage(camera.video, 0, 0, camera.width, camera.height);

    // Вырезаем области глаз
    const leftEyePoints = [...POINTS.LEFT_EYE_BORDER] as number[];
    const leftEyeImg = this.cropEye(leftEyePoints);

    const rightEyePoints = [...POINTS.RIGHT_EYE_BORDER] as number[];
    const rightEyeImg = this.cropEye(rightEyePoints); 
  }

    /**
   * Вырезает область вокруг группы лендмарков
   * @param indices — массив индексов лендмарков (this.points) для одной области (глаз)
   * @returns canvas с вырезанным регионом
   */
    private cropEye(indices: number[]): HTMLCanvasElement {
      // находим границы бокса
      let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
      for (const idx of indices) {
        const p = this.points[idx];
        minX = Math.min(minX, p.x);
        minY = Math.min(minY, p.y);
        maxX = Math.max(maxX, p.x);
        maxY = Math.max(maxY, p.y);
      }
      // немного расширим область на 10% для гарантии охвата
      const padX = (maxX - minX) * 0.1;
      const padY = (maxY - minY) * 0.1;
      minX = Math.max(0, minX - padX);
      minY = Math.max(0, minY - padY);
      maxX = Math.min(this.hiddenCanvas.width,  maxX + padX);
      maxY = Math.min(this.hiddenCanvas.height, maxY + padY);
  
      const w = maxX - minX;
      const h = maxY - minY;
  
      // создаём временный canvas для вырезки
      const eyeCanvas = document.createElement('canvas');
      eyeCanvas.width  = Math.round(w);
      eyeCanvas.height = Math.round(h);
      const eyeCtx = eyeCanvas.getContext('2d')!;
  
      // вырезаем регион из основного canvas
      eyeCtx.drawImage(
        this.hiddenCanvas,
        minX, minY, w, h,       // область source
        0, 0, eyeCanvas.width, eyeCanvas.height // куда рисуем
      );
  
      return eyeCanvas;
    }  

  // находит координаты центров глаз как среднее значение координат через значение points
  getEyesCenterCoordinates(){
    let leftX = 0, leftY = 0, leftZ = 0,
      rightX = 0, rightY = 0, rightZ = 0;

    for (let i = 0; i < POINTS.LEFT_EYE_BORDER.length; i++) {
      const point = this.points[POINTS.LEFT_EYE_BORDER[i]]
      leftX += point.x
      leftY += point.y
      leftZ += point.z
    }

    let leftEyeBorderPointsCount:number = POINTS.LEFT_EYE_BORDER.length
    let leftEyeCenter = new Vector3(leftX/leftEyeBorderPointsCount, leftY/leftEyeBorderPointsCount, leftZ/leftEyeBorderPointsCount)

    for (let i = 0; i < POINTS.RIGHT_EYE_BORDER.length; i++) {
      const point = this.points[POINTS.RIGHT_EYE_BORDER[i]]
      rightX += point.x
      rightY += point.y
      rightZ += point.z
    }

    let rightEyeBorderPointsCount:number = POINTS.RIGHT_EYE_BORDER.length
    let rightEyeCenter = new Vector3(rightX/rightEyeBorderPointsCount, rightY/rightEyeBorderPointsCount, rightZ/rightEyeBorderPointsCount)


    return {
        leftEyeCenter,
        rightEyeCenter
    }
  }

  // Возвращает координаты определяющие систему координат головы пользователя
  getHeadVectors() {
    // 1. Получаем ключевые точки лица
    let {rightEyeCenter, leftEyeCenter} = this.getEyesCenterCoordinates()
    const mouthCenter = this.points[POINTS.MOUTH_CENTER]
    const betweenEyesCoordinates = this.points[POINTS.BETWEEN_EYES]

    // Ось X: от правого глаза к левому
    const xAxis = new Vector3()
      .subVectors(leftEyeCenter, rightEyeCenter)
      .normalize()

    // Ось Y: от центра между глаз к центру рта
      const yAxis = new Vector3()
      .subVectors(betweenEyesCoordinates, mouthCenter)
      .normalize()

    // Ось Z: векторное произведение X и Y
    const zAxis = new Vector3()
      .crossVectors(xAxis, yAxis)
      .normalize()


    return { 
      xAxis, 
      yAxis, 
      zAxis,
    }
  }

  // надо использовать формулу для определения межзрачкового расстояния из диплома
  // D = f*Dimg/Dconst
  calculateScale() {
    const {leftEyeCenter, rightEyeCenter} = this.getEyesCenterCoordinates()

    let distanceInPx = rightEyeCenter.distanceTo(leftEyeCenter)

    // Масштабирование с учетом целевого расстояния
    return {
      scale: Math.round((IPD_MM / distanceInPx)/CAMERA_PARAMS.INTRINSIC_PARAMS.xFocalLengthInMM),
    }
  }
}

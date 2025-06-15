import { FilesetResolver, FaceLandmarker } from '@mediapipe/tasks-vision'
import { Matrix4, Vector3, Ray } from 'three'

import { POINTS_NUMBER, POINTS, IPD_MM } from './FaceTracker.constants'

import { getIrisWidthInPx } from './FaceTracker.helpers'

import { FaceCamera } from '../FaceCamera/FaceCamera'

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
  public hiddenCanvas!:HTMLCanvasElement;
  public ctx!:CanvasRenderingContext2D

  landmarksFound = false

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
  }

  update(camera: FaceCamera) {
    this.landmarksFound = false
    if (!camera.video || !this.landmarker) {
      return
    }

    const {
      faceLandmarks: [landmarks],
      facialTransformationMatrixes: [transformationMatrix]
    } = this.landmarker.detectForVideo(camera.video, performance.now())

    if (!landmarks) return
    this.landmarksFound = true

    landmarks.forEach(({ x, y, z }, i) => {
      this.points[i].set(
        x * camera.width,
        y * camera.height,
        z
      )})

    this.transform.fromArray(transformationMatrix.data)
    this.direction.setFromMatrixColumn(this.transform, 2)

    const middle = this.points[POINTS.BETWEEN_EYES]

    this.ray.set(middle, this.direction)
    this.ray.intersectPlane(camera.plane, this.intersection)

    this.irisWidthInPx = getIrisWidthInPx(this.points)

    // создаём скрытый canvas
    this.hiddenCanvas = document.createElement('canvas');
    this.hiddenCanvas.width  = camera.width;
    this.hiddenCanvas.height = camera.height;
    this.ctx = this.hiddenCanvas.getContext('2d')!;    

    this.ctx.clearRect(0, 0, camera.width, camera.height);
    this.ctx.drawImage(camera.video, 0, 0, camera.width, camera.height);
  }

  public cropLeftEye() : {
    image:HTMLCanvasElement,
    startX: number,
    startY: number,
    width: number,
    height: number
  }{
    const leftEyePoints = [...POINTS.LEFT_EYE_BORDER] as number[];
    return this.cropEye(leftEyePoints)
  }

  public cropRigthEye(): {
    image:HTMLCanvasElement,
    startX: number,
    startY: number,
    width: number,
    height: number
  }{
    const rightEyePoints = [...POINTS.RIGHT_EYE_BORDER] as number[];
    return this.cropEye(rightEyePoints);  
  }

    /**
   * Вырезает область вокруг группы лендмарков
   * @param indices — массив индексов лендмарков (this.points) для одной области (глаз)
   * @returns canvas с вырезанным регионом
   */
    private cropEye(indices: number[]): {
      image:HTMLCanvasElement,
      startX: number,
      startY: number,
      width: number,
      height: number
    } {
      // находим границы бокса
      let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
      for (const idx of indices) {
        const p = this.points[idx];
        minX = Math.min(minX, p.x);
        minY = Math.min(minY, p.y);
        maxX = Math.max(maxX, p.x);
        maxY = Math.max(maxY, p.y);
      }

      // добавление паддинга для области глаз
      // определяется эксперементально
      const padX = (maxX - minX) * 0;
      const padY = (maxY - minY) * 0.5;
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
  
      return {
        image: eyeCanvas,
        startX: minX,
        startY: minY,
        height: h,
        width: w
      };
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
    let leftEyeCenter = new Vector3(
      leftX/leftEyeBorderPointsCount, 
      leftY/leftEyeBorderPointsCount, 
      leftZ/leftEyeBorderPointsCount
    )

    for (let i = 0; i < POINTS.RIGHT_EYE_BORDER.length; i++) {
      const point = this.points[POINTS.RIGHT_EYE_BORDER[i]]
      rightX += point.x
      rightY += point.y
      rightZ += point.z
    }

    let rightEyeBorderPointsCount:number = POINTS.RIGHT_EYE_BORDER.length
    let rightEyeCenter = new Vector3(
      rightX/rightEyeBorderPointsCount, 
      rightY/rightEyeBorderPointsCount, 
      rightZ/rightEyeBorderPointsCount
    )
    return {leftEyeCenter, rightEyeCenter}
  } 

  // Возвращает координаты определяющие систему координат головы пользователя
  getHeadAxis(): { 
      xAxis: Vector3, 
      yAxis: Vector3, 
      zAxis: Vector3,
    } {
    const rigthEyeInnerCorner = this.points[POINTS.RIGTH_EYE_INNER_CORNER]
    const leftEyeInnerCorner = this.points[POINTS.LEFT_EYE_INNER_CORNER]
    const mouthCenter = this.points[POINTS.MOUTH_CENTER]

    // Ось X: от правого глаза к левому
    const xAxis = new Vector3()
      .subVectors(leftEyeInnerCorner, rigthEyeInnerCorner)
      .normalize()

    // Ось Y: от центра между глаз к центру рта
    const betweenEyes = new Vector3()
      .addVectors(rigthEyeInnerCorner, leftEyeInnerCorner)
      .multiplyScalar(0.5);

    const yAxis = new Vector3()
      .subVectors(mouthCenter, betweenEyes)
      .normalize();

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

  calculateDistanceBetweenCameraAndUser(
    leftEyeCenter:Vector3, 
    rightEyeCenter: Vector3, 
    xCameraFocalLength :number
  ) :number {
    const dx = rightEyeCenter.x - leftEyeCenter.x;
    const dy = rightEyeCenter.y - leftEyeCenter.y;
    const ipdPx = Math.sqrt(dx*dx + dy*dy);

    return (IPD_MM / ipdPx)*xCameraFocalLength
  }
}

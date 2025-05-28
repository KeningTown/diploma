import { Vector3 } from 'three'
import { KalmanFilter, KalmanState } from 'kalman-filter'

import {
  DEFAULT_SCREEN_DIAGONAL,
  DEFAULT_DIAGONAL_FOV,
  DEFAULT_IRIS_WIDTH,
  SCREEN_HALF_WIDTH,
  SCREEN_HALF_HEIGHT
} from '../constants'
import { KALMAN_FILTER_OPTIONS, GAZE_PREDICTION_MODEL_PATH, REGRESSION_MODEL_WEIGTHS_LOCAL_STORAGE_KEY } from './FaceControls.constants'
import {
  WASM_PATH,
  MODEL_ASSET_PATH
} from '../FaceTracker/FaceTracker.constants'

import { FaceScreen } from '../FaceScreen/FaceScreen'
import { FaceCamera } from '../FaceCamera/FaceCamera'
import { FaceTracker } from '../FaceTracker/FaceTracker'
import { FaceNormalizer } from '../FaceNormalizer/FaceNormalizer'
import { loadOpenCV } from './FaceControls.helpers'
import MLR  from "ml-regression-multivariate-linear";
import { GazePredictor } from '../GazePredictor/GazePredictor'

type HandleGaze = (x: number, y: number) => void

export type GazeFeatures = {
    rigthEyePitch: number,
    rigthEyeYaw: number,
    leftEyePitch: number,
    leftEyeYaw: number,
    leftEyeCenter:{
      x: number,
      y: number
    },
    rightEyeCenter:{
      x: number,
      y: number
    },
    userToCameraDistance: number
}

export class FaceControls {
  initialized = false
  started = false
  container: HTMLDivElement | undefined
  screen: FaceScreen
  camera: FaceCamera
  tracker: FaceTracker
  normalizer: FaceNormalizer
  gazePredictor: GazePredictor
  irisWidth = DEFAULT_IRIS_WIDTH
  animation: number | undefined
  regressionModel!: MLR
  target = new Vector3()
  kalman = new KalmanFilter(KALMAN_FILTER_OPTIONS)
  kalmanState: KalmanState

  private isLearningMode!: boolean
  private stopped:boolean

  onGaze: HandleGaze = () => undefined

  // Дополнительные canvas под отладку
  public leftEyeCanvas?: HTMLCanvasElement;
  public rightEyeCanvas?: HTMLCanvasElement;
  public fullPhotoCanvas?: HTMLCanvasElement
  public normalizedLeftEyeCanvas?:HTMLCanvasElement
  public normalizedRigthEyeCanvas?:HTMLCanvasElement
  public normalizedRescaledGrayLeftEyeCanvas?:HTMLCanvasElement
  public normalizedRescaledGrayRigthEyeCanvas?:HTMLCanvasElement

  constructor() {
    this.screen = new FaceScreen()
    this.camera = new FaceCamera()
    this.tracker = new FaceTracker()
    this.normalizer = new FaceNormalizer()
    this.gazePredictor = new GazePredictor()
    this.stopped = false
  }

  async init(
    containerId: string,
    landmarkerWasmPath = WASM_PATH,
    landmarkerModelAssetPath = MODEL_ASSET_PATH,
    gazePredictionModelPath = GAZE_PREDICTION_MODEL_PATH
  ) {
    if (this.initialized) {
      return
    }

    this.container = document.createElement('div')
    this.container.id = containerId

    document.body.appendChild(this.container)

    await this.camera.init(this.container)
    await this.tracker.init(landmarkerWasmPath, landmarkerModelAssetPath)
    await loadOpenCV()
    await this.gazePredictor.init(gazePredictionModelPath)
    
    this.isLearningMode = true

    const raw = localStorage.getItem(REGRESSION_MODEL_WEIGTHS_LOCAL_STORAGE_KEY);
    if (raw) {
      const parsed: MLR.MLRModel = JSON.parse(raw);      
      this.regressionModel = MLR.load(parsed)
      this.isLearningMode = false
    }

    this.initialized = true
  }

  async startCamera(){
    await this.camera.start()
  }

  setIrisWidth(value: number) {
    this.irisWidth = value
  }

  setOnGaze(onGaze: HandleGaze) {
    this.onGaze = onGaze
  }

  async startPredictionLoop() {
    this.stopped = false
    if (this.started || this.isLearningMode) {
      return
    }

    this.started = true

    if (this.screen.diagonal === 0) {
      this.screen.setDiagonal(DEFAULT_SCREEN_DIAGONAL)
    }

    this.screen.addEvent()

    await this.startCamera()

    if (this.camera.diagonalFov === 0) {
      this.camera.setDiagonalFov(DEFAULT_DIAGONAL_FOV)
    }
   
    // const features:GazeFeatures[] =[]
    // const res:{x:number, y:number}[] = []
    // for (let i = 0; i < data.length; i++){
    //   features.push(data[i].gazeFeatures)
    //   res.push(data[i].target)
    // }

    // this.learnRegressionModel(features, res)

    await this.loop()
  }

  async stopCamera(){
    this.camera.stop()
  }

  stop() {
    this.stopped = true
    if (!this.started || !this.animation) {
      return
    }
    this.started = false

    this.screen.removeEvent()
    this.camera.stop()

    cancelAnimationFrame(this.animation)

    this.animation = undefined
  }

  async loop() {
    if (this.stopped){
      return
    }

    const gazeFeatures = await this.getGazeFeatures()
    if (!gazeFeatures){
      this.animation = requestAnimationFrame(() => this.loop())
      return
    }

    // const irisRatio = this.tracker.irisWidthInPx / this.irisWidth

    // this.screen.halfScale
    //   .copy(this.screen.halfScaleReal)
    //   .multiplyScalar(irisRatio)

    // this.screen.center.setY(-this.screen.halfScale.y)

    // this.target
    //   .copy(this.tracker.intersection)
    //   .sub(this.screen.center)
    //   .divide(this.screen.halfScale)

    // if (!isNaN(this.target.x)) {
    //   this.target.setX((1 - this.target.x) * SCREEN_HALF_WIDTH)
    //   this.target.setY((1 - this.target.y) * SCREEN_HALF_HEIGHT)
    //   this.target.sub(this.screen.viewport)

    //   this.kalmanState = this.kalman.filter({
    //     previousCorrected: this.kalmanState,
    //     observation: [this.target.x, this.target.y]
    //   })

    //   const { mean } = this.kalmanState

    //   this.target.setX(mean[0][0])
    //   this.target.setY(mean[1][0])

    //   this.onGaze(this.target.x, this.target.y)
    // }

    // тут определяем пересечение вектора с плоскостью экрана

    let screenCoodinates = this.regressionModel.predict([
      gazeFeatures.leftEyePitch, 
      gazeFeatures.leftEyeYaw, 
      gazeFeatures.rigthEyePitch, 
      gazeFeatures.rigthEyeYaw,
      gazeFeatures.leftEyeCenter.x,
      gazeFeatures.leftEyeCenter.y,
      gazeFeatures.rightEyeCenter.x,
      gazeFeatures.rightEyeCenter.y,
      gazeFeatures.userToCameraDistance
    ])

    if (!(screenCoodinates.length == 2) || screenCoodinates[0] == undefined || screenCoodinates[1] == undefined){
      this.animation = requestAnimationFrame(() => this.loop())
      return
    }

    this.kalmanState = this.kalman.filter({
      previousCorrected: this.kalmanState,
      observation: [screenCoodinates[0], screenCoodinates[1]]
    })

    const { mean } = this.kalmanState
        
    const x = mean[0][0]
    const y = mean[1][0]

    console.log("Координаты центра области на экране монитора:\nx:", x, "\ny:", y) 

    this.onGaze(x, y)

    this.animation = requestAnimationFrame(() => this.loop())
  }

  async getGazeFeatures(): Promise<GazeFeatures| undefined > {
    this.tracker.update(this.camera)

    if (!this.tracker.landmarksFound){
      return undefined
    }

    // строим вектора системы координат головы
    const headAxis = this.tracker.getHeadAxis()
    // console.log("headAxis", headAxis)
    // console.log("Проверка на ортогональность.\nСкалярные произведения векторов:\nxAxis*yAxis", headAxis.xAxis.dot(headAxis.yAxis), "\nxAxis*zAxis", headAxis.xAxis.dot(headAxis.zAxis), "\nyAxis*zAxis", headAxis.yAxis.dot(headAxis.zAxis))
    // console.log("Проверка на ортогональность. Скалярные произведения векторов:\nxAxis*yAxis", headAxis.xAxis.dot(headAxis.yAxis), "\nxAxis*zAxis", headAxis.xAxis.dot(headAxis.zAxis), "\nyxAxis*zAxis", headAxis.yAxis.dot(headAxis.zAxis))
    // console.log("Проверка на единичность векторов:\nДлина xAxis:", headAxis.xAxis.length(), "\nДлина yAxis:", headAxis.yAxis.length(),"\nДлина zAxis:", headAxis.zAxis.length())
    const camereIntrinsicParams = this.camera.getCameraIntrinsicMatrix()
  
    // получить обрезанные изображения правого и левого глаза
    const leftCroppedEye = this.tracker.cropLeftEye()
    const rigthCroppedEye = this.tracker.cropRigthEye()
    
    const {leftEyeCenter, rightEyeCenter} = this.tracker.getEyesCenterCoordinates()
    
    const userToCameraDistance = this.tracker.calculateDistanceBetweenCameraAndUser(leftEyeCenter, rightEyeCenter, camereIntrinsicParams.toArray()[0])
    const {W, R} = this.normalizer.getWarpPerspectiveMatrix(headAxis, userToCameraDistance, camereIntrinsicParams)
       
    try{
      var normalizedEyes = this.normalizer.normalizeImage(
        this.tracker.hiddenCanvas, 
        W, 
        {
          xRoiStart: leftCroppedEye.startX, 
          yRoiStart: leftCroppedEye.startY,
          roiWidth: leftCroppedEye.width,
          roiHeigth: leftCroppedEye.height
        },
        {
          xRoiStart: rigthCroppedEye.startX, 
          yRoiStart: rigthCroppedEye.startY,
          roiWidth: rigthCroppedEye.width,
          roiHeigth: rigthCroppedEye.height
        },
      )
    } catch (e){
      console.error("error during image normalzation", {err: e})
      return undefined
    }

    // создаём временный canvas для вырезки
    let leftNormilizedCanvas = document.createElement('canvas');
    let rigthNormilizedCanvas = document.createElement('canvas');

    const leftGaze = await this.gazePredictor.predictGaze(normalizedEyes.leftEyeCanvas, leftNormilizedCanvas)
    const rigthGaze = await this.gazePredictor.predictGaze(normalizedEyes.rigthEyeCanvas, rigthNormilizedCanvas)

    console.log("pregedicted gaze angels", {
      left: leftGaze,
      right: rigthGaze
    })

    const leftOrginalGaze = this.normalizer.unnormalizeAngels(leftGaze.pitch, leftGaze.yaw, R)
    const rigthOrginalGaze = this.normalizer.unnormalizeAngels(rigthGaze.pitch, rigthGaze.yaw, R)
    
    // debug
    // console.log("Координаты центра правого глаза:\nx:", rightEyeCenter.x, "\ny:", rightEyeCenter.y, "\nКоординаты центра левого глаза:\nx:", leftEyeCenter.x, "\ny:", leftEyeCenter.y)
    // console.log("Расстояние между пользователем и камерой:", userToCameraDistance, " мм")
    // console.log("Углы отклонения правого глаза:\npitch:", rigthOrginalGaze.pitch ,"\nyaw:", rigthOrginalGaze.yaw)
    // console.log("Углы отклонения левого глаза:\npitch:", leftOrginalGaze.pitch,"\nyaw:", leftOrginalGaze.yaw)

    const leftGazeVector = this.normalizer.unnormalizeAngelsToVector(leftGaze.pitch, leftGaze.yaw, R)
    const rigthGazeVector = this.normalizer.unnormalizeAngelsToVector(rigthGaze.pitch, rigthGaze.yaw, R)
    // const leftGazeVector = this.normalizer.unnormalizeAngelsToVector(leftGaze.yaw, leftGaze.pitch, R)
    // const rigthGazeVector = this.normalizer.unnormalizeAngelsToVector(rigthGaze.yaw, rigthGaze.pitch, R)

    console.log("gaze vectors", {leftGazeVector, rigthGazeVector})
    // начертить на full изображении вектор направления взгляда

    drawVector(this.tracker.ctx, leftEyeCenter, leftGazeVector, 200, "red")
    drawVector(this.tracker.ctx, rightEyeCenter, rigthGazeVector, 200, "red")

    //debug
    { 
      this.leftEyeCanvas = leftCroppedEye.image
      this.rightEyeCanvas = rigthCroppedEye.image
      this.fullPhotoCanvas = this.tracker.hiddenCanvas
      this.normalizedLeftEyeCanvas = normalizedEyes.leftEyeCanvas
      this.normalizedRigthEyeCanvas = normalizedEyes.rigthEyeCanvas
      this.normalizedRescaledGrayLeftEyeCanvas = leftNormilizedCanvas
      this.normalizedRescaledGrayRigthEyeCanvas = rigthNormilizedCanvas
    }

    return {
      rigthEyePitch: rigthOrginalGaze.pitch,
      rigthEyeYaw: rigthOrginalGaze.yaw,
      leftEyePitch: leftOrginalGaze.pitch,
      leftEyeYaw: leftOrginalGaze.yaw,
      leftEyeCenter: leftEyeCenter,
      rightEyeCenter: rightEyeCenter,
      userToCameraDistance: userToCameraDistance
    }
  }

  learnRegressionModel(eyeParams: GazeFeatures[],
  screenCoordinates: {
    x: number,
    y: number
  }[]){    
    let inputs:number[][] = []
    let outputs:number[][] = []
    for (let i = 0; i < eyeParams.length; i++) {
      const param = eyeParams[i];
      inputs.push([
        param.leftEyePitch, 
        param.leftEyeYaw, 
        param.rigthEyePitch, 
        param.rigthEyeYaw,
        param.leftEyeCenter.x,
        param.leftEyeCenter.y,
        param.rightEyeCenter.x,
        param.rightEyeCenter.y,
        param.userToCameraDistance
      ])

      const coordinates = screenCoordinates[i];
      outputs.push([coordinates.x, coordinates.y])
    }

    this.regressionModel = new MLR(inputs, outputs)
    localStorage.setItem(REGRESSION_MODEL_WEIGTHS_LOCAL_STORAGE_KEY, JSON.stringify(this.regressionModel.toJSON()));
    
    this.isLearningMode = false
  }


  // debug
  getEyeCanvases():{
    left?: HTMLCanvasElement
    right?: HTMLCanvasElement
    full? :HTMLCanvasElement
    normRigth?: HTMLCanvasElement
    normLeft?: HTMLCanvasElement,
    rezisedGrayLeft?: HTMLCanvasElement,
    rezisedGrayRigth?: HTMLCanvasElement
  }{
    return {
      left: this.leftEyeCanvas,
      right: this.rightEyeCanvas,
      full: this.fullPhotoCanvas,
      normLeft: this.normalizedLeftEyeCanvas,
      normRigth: this.normalizedRigthEyeCanvas,
      rezisedGrayLeft: this.normalizedRescaledGrayLeftEyeCanvas,
      rezisedGrayRigth: this.normalizedRescaledGrayRigthEyeCanvas
    }
  }
}


function drawVector(
  ctx: CanvasRenderingContext2D,
  origin: { x: number, y: number },
  direction: { x: number, y: number },
  length: number = 100,
  color: string = 'red'
) {
  // Вычисляем конечную точку вектора
  // const magnitude = Math.sqrt(direction.x ** 2 + direction.y ** 2);
  // const unitX = direction.x / magnitude;
  // const unitY = direction.y / magnitude;

  const endX = origin.x + direction.x * length;
  const endY = origin.y + direction.y * length;

  // Рисуем линию (вектор)
  ctx.strokeStyle = color;
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(origin.x, origin.y);
  ctx.lineTo(endX, endY);
  ctx.stroke();

  // Добавим стрелку
  drawArrowhead(ctx, origin, { x: endX, y: endY }, color);
}

function drawArrowhead(
  ctx: CanvasRenderingContext2D,
  from: { x: number, y: number },
  to: { x: number, y: number },
  color: string
) {
  const headLength = 10;
  const dx = to.x - from.x;
  const dy = to.y - from.y;
  const angle = Math.atan2(dy, dx);

  ctx.beginPath();
  ctx.moveTo(to.x, to.y);
  ctx.lineTo(to.x - headLength * Math.cos(angle - Math.PI / 6), to.y - headLength * Math.sin(angle - Math.PI / 6));
  ctx.lineTo(to.x - headLength * Math.cos(angle + Math.PI / 6), to.y - headLength * Math.sin(angle + Math.PI / 6));
  ctx.lineTo(to.x, to.y);
  ctx.fillStyle = color;
  ctx.fill();
}

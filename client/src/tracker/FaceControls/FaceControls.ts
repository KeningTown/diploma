import { Vector3 } from 'three'
import { KalmanFilter, KalmanState } from 'kalman-filter'

import {
  DEFAULT_SCREEN_DIAGONAL,
  DEFAULT_DIAGONAL_FOV,
  DEFAULT_IRIS_WIDTH,
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
import { GazePredictor } from '../GazePredictor/GazePredictor'
import { PolynomialRegressionModel } from '../PolynomialRegressionModel/PolynomialRegressionModel'
import { IntrinsicParams, Point2D } from '../helpers'

type HandleGaze = (x: number, y: number) => void

export type GazeFeatures = {
    rigthEyePitch: number,
    rigthEyeYaw: number,
    leftEyePitch: number,
    leftEyeYaw: number,
    leftEyeCenter: Vector3,
    rightEyeCenter: Vector3,
    userToCameraDistance: number,
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
  polynomialRegressionModel: PolynomialRegressionModel  
  irisWidth = DEFAULT_IRIS_WIDTH
  animation: number | undefined
  target = new Vector3()
  kalman = new KalmanFilter(KALMAN_FILTER_OPTIONS)
  kalmanState: KalmanState

  private isLearningMode!: boolean
  private stopped:boolean

  onGaze: HandleGaze = () => undefined

  constructor() {
    this.screen = new FaceScreen()
    this.camera = new FaceCamera()
    this.tracker = new FaceTracker()
    this.normalizer = new FaceNormalizer()
    this.gazePredictor = new GazePredictor()
    this.polynomialRegressionModel = new PolynomialRegressionModel(2, 10)
    this.stopped = false
  }

  setIntrinsicParams(params:IntrinsicParams){
    this.camera.setIntrinsicParams(params)
    this.normalizer.setIntrinsicParams(params)
  }

  async init(
    containerId: string,
    landmarkerWasmPath = WASM_PATH,
    landmarkerModelAssetPath = MODEL_ASSET_PATH,
    gazePredictionModelPath = GAZE_PREDICTION_MODEL_PATH,
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
      const ok = this.polynomialRegressionModel.loadModel(REGRESSION_MODEL_WEIGTHS_LOCAL_STORAGE_KEY)
      if (ok){
        this.isLearningMode = false
      }     
    }

    this.initialized = true
  }

  getIsLearningMode():boolean{
    return this.isLearningMode
  }

  async startCamera(){
    await this.camera.start()
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

    const [predictedX, predictedY] = this.polynomialRegressionModel.predict([
      gazeFeatures.leftEyeYaw,
      gazeFeatures.leftEyePitch,
      gazeFeatures.rigthEyeYaw,
      gazeFeatures.rigthEyePitch,
      gazeFeatures.leftEyeCenter.x,
      gazeFeatures.leftEyeCenter.y,
      gazeFeatures.rightEyeCenter.x,
      gazeFeatures.rightEyeCenter.y,
      gazeFeatures.userToCameraDistance
    ])

    this.kalmanState = this.kalman.filter({
      previousCorrected: this.kalmanState,
      observation: [predictedX, predictedY]
    })

    const { mean } = this.kalmanState
        
    let x = mean[0][0]
    let y = mean[1][0]

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

    const leftGaze = await this.gazePredictor.predictGaze(normalizedEyes.leftEyeCanvas)
    const rigthGaze = await this.gazePredictor.predictGaze(normalizedEyes.rigthEyeCanvas)

    const leftOrginalGaze = this.normalizer.unnormalizeAngels(leftGaze.pitch, leftGaze.yaw, R)
    const rigthOrginalGaze = this.normalizer.unnormalizeAngels(rigthGaze.pitch, rigthGaze.yaw, R)

    return {
      rigthEyePitch: rigthOrginalGaze.pitch,
      rigthEyeYaw: rigthOrginalGaze.yaw,
      leftEyePitch: leftOrginalGaze.pitch,
      leftEyeYaw: leftOrginalGaze.yaw,
      leftEyeCenter,
      rightEyeCenter,
      userToCameraDistance,
    }
  }

  learnRegressionModel(gazeFeatures: GazeFeatures[], screenCoordinates: Point2D[]):void{
    let inputFeatures: number[][] = []
    gazeFeatures.forEach((features)=>{
      inputFeatures.push([
        features.leftEyeYaw,
        features.leftEyePitch,
        features.rigthEyeYaw,
        features.rigthEyePitch,
        features.leftEyeCenter.x,
        features.leftEyeCenter.y,
        features.rightEyeCenter.x,
        features.rightEyeCenter.y,
        features.userToCameraDistance
      ])
    })

    let outputX:number[] = []
    let outputY:number[] = []
    screenCoordinates.forEach((coordinate)=>{
      outputX.push(coordinate.x)
      outputY.push(coordinate.y)
    })

    this.polynomialRegressionModel.fit(inputFeatures, outputX, outputY)

    this.polynomialRegressionModel.saveModel(REGRESSION_MODEL_WEIGTHS_LOCAL_STORAGE_KEY)

    this.isLearningMode = false
  }
}

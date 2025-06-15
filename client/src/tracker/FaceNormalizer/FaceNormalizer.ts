import { Matrix4, Vector3, Ray, Matrix3 } from 'three'

import {NORMILIZED_USER_TO_CAMERA_DISTANCE} from '../constants'
import {IntrinsicParams} from '../helpers'

import { FaceTracker } from '../FaceTracker/FaceTracker'

export class FaceNormalizer {
  tracker: FaceTracker

  // матрица поворота
  rotationMatrix = new Matrix3()

  transform = new Matrix4()
  direction = new Vector3()
  ray = new Ray()
  intersection = new Vector3()
  intrinsicParams!:IntrinsicParams
  
  constructor(){
    this.tracker = new FaceTracker
  }

  setIntrinsicParams(params: IntrinsicParams):void{
    this.intrinsicParams = params
  }

  public getWarpPerspectiveMatrix(headAxis :{
    xAxis: Vector3,
    yAxis: Vector3,
    zAxis: Vector3,
  }, 
  userToCameraDistance :number,
  intrinsicCameraParams :Matrix3,
  ) :{W: Matrix3, R: Matrix3}{
    const {xNormAxis, yNormAxis, zNormAxis} = this.getNormalizedCameraAxis(headAxis)
    
    const rotationMatrix = new Matrix3().set(
      xNormAxis.x, xNormAxis.y, xNormAxis.z,
      yNormAxis.x, yNormAxis.y, yNormAxis.z,  
      zNormAxis.x, zNormAxis.y, zNormAxis.z   
    );

    const scale = NORMILIZED_USER_TO_CAMERA_DISTANCE/userToCameraDistance  
    const scaleMatrix = new Matrix3().set(
      1, 0, 0,
      0, 1, 0,
      0, 0, scale,
    )

    const M = new Matrix3().multiplyMatrices(scaleMatrix, rotationMatrix)
    
    const params = this.intrinsicParams
    const normalizedCameraIntrinsicParams = new Matrix3().set(
      params.focalLength.x, 0, params.principlePoint.x,
      0, params.focalLength.y, params.principlePoint.y,
      0, 0, 1
    )

    const cameraIntrinsicParamsInv = new Matrix3()
      .copy(intrinsicCameraParams)
      .invert()

    const temp = new Matrix3().multiplyMatrices(normalizedCameraIntrinsicParams, M)
    const W = new Matrix3().multiplyMatrices(temp, cameraIntrinsicParamsInv)

    return {W, R: rotationMatrix}
  }

  private getNormalizedCameraAxis(headAxis :{
    xAxis: Vector3,
    yAxis: Vector3,
    zAxis: Vector3,
  }): {
    xNormAxis: Vector3,
    yNormAxis: Vector3,
    zNormAxis: Vector3
  } {
    const zNormAxis = headAxis.zAxis.clone().normalize()

    const xProj = headAxis.xAxis.clone()
      .sub(zNormAxis.clone().multiplyScalar(headAxis.xAxis.dot(zNormAxis)))
      .normalize();
    const xNormAxis = xProj;

    const yNormAxis = new Vector3()
      .crossVectors(zNormAxis, xNormAxis)
      .normalize()

    return {
      xNormAxis,
      yNormAxis,
      zNormAxis
    }
  }

  normalizeImage(
    image :HTMLCanvasElement, 
    warpMatrix: Matrix3,
    leftEyeROI: {
      xRoiStart: number,
      yRoiStart: number,
      roiWidth: number,
      roiHeigth: number
    },
    rigthEyeROI: {
      xRoiStart: number,
      yRoiStart: number,
      roiWidth: number,
      roiHeigth: number
    }
  ):{
    leftEyeCanvas: HTMLCanvasElement
    rigthEyeCanvas: HTMLCanvasElement
  }{
    let leftCroppedEye :{cropped?: any,   width: number, height: number } = {cropped: undefined, width: 0, height: 0}
    let rigthCroppedEye :{cropped?: any,   width: number, height: number } = {cropped: undefined, width: 0, height: 0}
    
    try{
      var srcRGBA = window.cv.imread(image);
      var src = new window.cv.Mat();
      try {
        window.cv.cvtColor(srcRGBA, src, window.cv.COLOR_RGBA2RGB);
      } catch (e){
        console.error("failed to cvtColor", {
          srcRGBA: [srcRGBA.cols, srcRGBA.rows, srcRGBA.type()],
          src: [src.cols, src.rows, src.type()]
        })
        throw(e)
      }
    
      var warpElements = warpMatrix.toArray(); 
      const warpData = [
        warpElements[0], warpElements[3], warpElements[6],
        warpElements[1], warpElements[4], warpElements[7],
        warpElements[2], warpElements[5], warpElements[8]
      ];
      var W = window.cv.matFromArray(3, 3, window.cv.CV_64F, warpData);
      for (let i = 0; i < 9; i++) {
        W.data64F[i] /= W.data64F[8];
      }
      var dst = new window.cv.Mat();
      const dsize = new window.cv.Size(src.cols, src.rows);
      try{
        window.cv.warpPerspective(src, dst, W, dsize,window.cv.INTER_LINEAR, window.cv.BORDER_CONSTANT, new window.cv.Scalar(255,0,0,255));
      } catch (e){
          console.error('warpPerspective failed', {
            err: e,
            srcSize: [src.cols, src.rows],
            Wshape: [W.rows, W.cols],
            dsize,
            Wdata64F: Array.from(W.data64F),
            Wdata32F: Array.from(W.data32F),
          });
      }
      leftCroppedEye = this.cropROI(dst, W, leftEyeROI)
      
      const leftEyeCanvas = document.createElement('canvas');
      leftEyeCanvas.width = leftCroppedEye.width;
      leftEyeCanvas.height = leftCroppedEye.height;
      window.cv.imshow(leftEyeCanvas, leftCroppedEye.cropped);

      rigthCroppedEye = this.cropROI(dst, W, rigthEyeROI)
      
      const rigthEyeCanvas = document.createElement('canvas');
      rigthEyeCanvas.width = rigthEyeCanvas.width;
      rigthEyeCanvas.height = rigthEyeCanvas.height;
      window.cv.imshow(rigthEyeCanvas, rigthCroppedEye.cropped);

      return {leftEyeCanvas, rigthEyeCanvas};
    } finally{
      srcRGBA?.delete();
      src?.delete();
      dst?.delete();
      W?.delete();
      leftCroppedEye.cropped?.delete()
      rigthCroppedEye.cropped?.delete()
    }
  }

  private cropROI(src:any, W:any, roi:{      
    xRoiStart: number,
    yRoiStart: number,
    roiWidth: number,
    roiHeigth: number
  }): {
    cropped: any
    width: number
    height: number 
  }{
    try{
    var roiSrcCorners = window.cv.matFromArray(
      4, 1, window.cv.CV_32FC2,
      [
        roi.xRoiStart,           roi.yRoiStart,
        roi.xRoiStart + roi.roiWidth, roi.yRoiStart,
        roi.xRoiStart + roi.roiWidth, roi.yRoiStart + roi.roiHeigth,
        roi.xRoiStart,           roi.yRoiStart + roi.roiHeigth,
      ]
    );

      // warped ROI interesting point 
      var roiCornersDest = new window.cv.Mat();
      try{
        window.cv.perspectiveTransform(roiSrcCorners, roiCornersDest, W);
      } catch (e){
          console.error('perspectiveTransform failed', {
            err: e,
            srcSize: [src.cols, src.rows],
            Wshape: [W.rows, W.cols],
            Wdata64F: Array.from(W.data64F),
            Wdata32F: Array.from(W.data32F),
            roiSrcConers: roiSrcCorners,
            roiCornersDest: roiCornersDest,
          });
          throw(e)
      }
      
      const xs = [];
      const ys = [];
      for (let i = 0; i < roiCornersDest.data32F.length; i += 2) {
        xs.push(roiCornersDest.data32F[i]);     // чётные индексы — x
        ys.push(roiCornersDest.data32F[i + 1]); // нечётные  — y
      }

      const xMin = Math.min(...xs);
      const xMax = Math.max(...xs);
      const yMin = Math.min(...ys);
      const yMax = Math.max(...ys);

      const warpedROI = {
        x:      Math.round(xMin),
        y:      Math.round(yMin),
        width:  Math.round(xMax - xMin),
        height: Math.round(yMax - yMin),
      };

      const rect = new window.cv.Rect(
        warpedROI.x,
        warpedROI.y,
        warpedROI.width,
        warpedROI.height
      );
      
      const cropped = src.roi(rect);

      return {
        cropped,
        width: warpedROI.width,
        height: warpedROI.height,
      }
    }  finally {
        roiSrcCorners.delete()
        roiCornersDest.delete()
    }
  } 

  unnormalizeAngels(pitch: number, yaw:number, R: Matrix3):{
    pitch: number,
    yaw: number
  }{
    const x = -Math.cos(pitch) * Math.sin(yaw);
    const y = -Math.sin(pitch);
    const z = -Math.cos(pitch) * Math.cos(yaw);

    const gazeVector = new Vector3(x, y, z)

    const RTransposed = R.clone().transpose()

    const originVector = gazeVector.applyMatrix3(RTransposed)
    
    const originalPitch = Math.asin(-originVector.y);
    const origianlYaw = Math.atan2(-originVector.x, -originVector.z);

    return {pitch: originalPitch, yaw: origianlYaw}
  }
}

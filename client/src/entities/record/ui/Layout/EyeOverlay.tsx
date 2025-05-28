import React, { useEffect, useState } from 'react'

type EyeFrames = { 
  left?: string;
  leftWidht?: number;
  leftHeigth?: number; 
  right?: string; 
  rightWidht?: number;
  rightHeigth?: number;
  full?: string;
  fullHeigth?:number,
  fullWidth?: number,
  normLeft?: string,
  normLeftWidht?: number,
  normLeftHeigth?: number,
  normRigth?: string,
  normRigthWidht?: number,
  normRigthHeigth?: number,
  rescaleRigth?: string,
  rescaleRigthWidht?: number,
  rescaleRigthHeigth?: number,
  rescaleLeft?: string,
  rescaleLefthWidht?: number,
  rescaleLeftHeigth?: number
}

export function EyeOverlay() {
  const [eyeFrames, setEyeFrames] = useState<EyeFrames>({})

  useEffect(() => {
    let rafId: number

    const update = () => {

      const { left, right, full, normLeft,  normRigth, rezisedGrayLeft, rezisedGrayRigth } = window.faceControls.getEyeCanvases()

      setEyeFrames({
        left: left?.toDataURL(),
        leftHeigth: left?.height,
        leftWidht: left?.width,
        right: right?.toDataURL(),
        rightHeigth: right?.height,
        rightWidht: right?.width,
        full: full?.toDataURL(),
        fullHeigth: full?.height,
        fullWidth: full?.width,
        normLeft: normLeft?.toDataURL(),
        normLeftHeigth: normLeft?.height,
        normLeftWidht: normLeft?.width,
        normRigth: normRigth?.toDataURL(),
        normRigthHeigth: normRigth?.height,
        normRigthWidht: normRigth?.width,
        rescaleLeft: rezisedGrayLeft?.toDataURL(),
        rescaleLefthWidht: rezisedGrayLeft?.width,
        rescaleLeftHeigth: rezisedGrayLeft?.height,
        rescaleRigth: rezisedGrayRigth?.toDataURL(),
        rescaleRigthWidht: rezisedGrayRigth?.width,
        rescaleRigthHeigth: rezisedGrayRigth?.height
      })
      
      rafId = requestAnimationFrame(update)
    }
    update()
    return () => cancelAnimationFrame(rafId)
  }, [])

  return (
    <>
      {eyeFrames.left && (
        <img
          src={eyeFrames.left}
          alt="Left Eye"
          style={{
            position: 'absolute',
            top: 10,
            left: eyeFrames.rightWidht,
            width: eyeFrames.leftWidht,
            height: eyeFrames.leftHeigth,
            objectFit: 'cover',
            border: '2px solid #fff',
            borderRadius: 4
          }}
        />
      )}
      {eyeFrames.right && (
        <img
          src={eyeFrames.right}
          alt="Right Eye"
          style={{
            position: 'absolute',
            top: 10,
            left: 10,
            width: eyeFrames.rightWidht,
            height: eyeFrames.rightHeigth,
            objectFit: 'cover',
            border: '2px solid #fff',
            borderRadius: 4
          }}
        />
      )}
      {eyeFrames.normRigth && (
        <img
          src={eyeFrames.normRigth}
          alt="Norm Right Eye"
          style={{
            position: 'absolute',
            top: 50,
            left: 240,
            width: eyeFrames.normRigthWidht,
            height: eyeFrames.normRigthHeigth,
            objectFit: 'cover',
            border: '2px solid #fff',
            borderRadius: 4
          }}
        />
      )}
      {eyeFrames.normLeft && (
        <img
          src={eyeFrames.normLeft}
          alt="Norm Left Eye"
          style={{
            position: 'absolute',
            top: 50,
            left: 10,
            width: eyeFrames.normLeftWidht,
            height: eyeFrames.normLeftHeigth,
            objectFit: 'cover',
            border: '2px solid #fff',
            borderRadius: 4
          }}
        />
      )},
      {eyeFrames.rescaleRigth && (
        <img
          src={eyeFrames.rescaleRigth}
          alt="Rigth rescaled gray eye"
          style={{
            position: 'absolute',
            top: 150,
            left: 10,
            width: eyeFrames.rescaleRigthWidht,
            height: eyeFrames.rescaleRigthHeigth,
            objectFit: 'cover',
            border: '2px solid #fff',
            borderRadius: 4
          }}
        />
      )},      
      {eyeFrames.rescaleLeft && (
        <img
          src={eyeFrames.rescaleLeft}
          alt="Left rescaled gray eye"
          style={{
            position: 'absolute',
            top: 150,
            left: 250,
            width: eyeFrames.rescaleLefthWidht,
            height: eyeFrames.rescaleLeftHeigth,
            objectFit: 'cover',
            border: '2px solid #fff',
            borderRadius: 4
          }}
        />
      )}
      {eyeFrames.full && (
        <img
          src={eyeFrames.full}
          alt="Left rescaled gray eye"
          style={{
            position: 'absolute',
            top: 400,
            left: 250,
            width: eyeFrames.fullWidth,
            height: eyeFrames.fullHeigth,
            objectFit: 'cover',
            border: '2px solid #fff',
            borderRadius: 4
          }}
        />
      )}

    </>
  )
}

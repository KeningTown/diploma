type HeatInstance = {
  _renderer: {
    canvas: HTMLCanvasElement
  }
  setData(data: {
    min: number
    max: number
    data: { x: number; y: number; value: number }[]
  })
}

type Heat = {
  create: (config: { container: HTMLDivElement }) => HeatInstance
}

declare interface Window {
  h337: Heat
  faceControls: FaceControls
}

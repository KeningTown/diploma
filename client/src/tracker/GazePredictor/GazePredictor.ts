import { GAZE_PREDICTION_MODEL_PATH } from './GazePredictor.constants'
import * as tf from '@tensorflow/tfjs';
import type { Tensor3D, Tensor4D } from '@tensorflow/tfjs';
import { Normalization } from './NormalizationLayer';
import { TFOpLambda } from './TFOpLambdaLayer';

export class GazePredictor {
  private model!: tf.LayersModel
  private initiated = false

  async init(
    gazePredictionModelPath = GAZE_PREDICTION_MODEL_PATH
  ) {
    if (this.initiated){
      return
    }
    
    tf.serialization.registerClass(Normalization)
    tf.serialization.registerClass(TFOpLambda)

    try {
      this.model = await tf.loadLayersModel(gazePredictionModelPath);
    } catch (err) {
      console.error('Ошибка при загрузке модели gaze_prediction_model', err);
    }

    this.initiated = true
  }

  async predictGaze(
    eyeImage: HTMLCanvasElement
  ): Promise<{
    pitch: number;
    yaw: number;
  }> {
    // Считываем RGB и ресайзим до 224×224 → Tensor3D
    const img: Tensor3D = tf.browser.fromPixels(eyeImage) as Tensor3D;
    const resizedImg = tf.image.resizeBilinear(img, [224, 224]) as Tensor3D;
    img.dispose()

    // В float и в ч/б
    const imgFloat: Tensor3D = resizedImg.toFloat() as Tensor3D;
    resizedImg.dispose()
    
    const [r, g, b] = tf.split(imgFloat, 3, 2) as [Tensor3D, Tensor3D, Tensor3D];
    const grayImage: Tensor3D = r.mul(0.299)
      .add(g.mul(0.587))
      .add(b.mul(0.114)) as Tensor3D;  // [224,224,1]

    r.dispose();
    g.dispose();
    b.dispose();
    imgFloat.dispose();

    // Восстанавливаем 3 канала → Tensor3D [224,224,3]
    const grayImage3Chan: Tensor3D = tf.tile(grayImage, [1, 1, 3]) as Tensor3D;
    grayImage.dispose();

    const normalizedImg: Tensor3D = grayImage3Chan.div(255.0) as Tensor3D;
    grayImage3Chan.dispose();

    const modelInput: Tensor4D = normalizedImg
      .expandDims(0) as Tensor4D;  // [1,224,224,3]

    const output = this.model.predict(modelInput) as tf.Tensor;
    const data = await output.data();  // [pitch, yaw]

    normalizedImg.dispose();
    modelInput.dispose();
    output.dispose();

    return {
      pitch: data[0],
      yaw: data[1],
    };
  }
}

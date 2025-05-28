import * as tf from '@tensorflow/tfjs';
import { Tensor, layers } from '@tensorflow/tfjs';

export class TFOpLambda extends layers.Layer {
  private yConst: Tensor;

  constructor(config: any) {
    super(config);

    if (!config.y) {
      throw new Error("TFOpLambda: параметр 'y' не найден в config");
    }

    // Преобразуем массив в Tensor
    this.yConst = tf.tensor(config.y, undefined, config.dtype || 'float32');
    this.name = config.name;
  }

  static get className() {
    return 'TFOpLambda';
  }

  call(inputs: Tensor | Tensor[], _: any): Tensor {
    const x = Array.isArray(inputs) ? inputs[0] : inputs;
    return tf.mul(x, this.yConst); // x * y
  }

  computeOutputShape(inputShape: tf.Shape | tf.Shape[]): tf.Shape | tf.Shape[] {
    return inputShape;
  }

  getConfig() {
    const baseConfig = super.getConfig();
    return {
      ...baseConfig,
      y: this.yConst.arraySync()  // чтобы сериализовать при сохранении модели
    };
  }
}

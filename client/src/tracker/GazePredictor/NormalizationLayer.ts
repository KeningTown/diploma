import * as tf from '@tensorflow/tfjs';

export interface NormalizationConfig {
  /** Axis or axes that should have a separate mean/variance. */
  axis?: number | number[];
  /** Optional precomputed mean(s). */
  mean?: number | number[];
  /** Optional precomputed variance(s). */
  variance?: number | number[];
  /** If true, applies inverse transformation. */
  invert?: boolean;
  /** Optional layer name. */
  name?: string;
  /** Optional dtype. */
  dtype?: tf.DataType;
}

export class Normalization extends tf.layers.Layer {
  static readonly className = 'Normalization';

  private axis: number[];
  private invert: boolean;
  private inputMean: tf.Tensor | null;
  private inputVariance: tf.Tensor | null;
  private keepAxes!: number[];
  private reduceAxes!: number[];
  private meanVarShape!: number[];
  private meanVar?: tf.LayerVariable;
  private varVar?: tf.LayerVariable;

  constructor(config: NormalizationConfig = {}) {
    super({ name: config.name, dtype: config.dtype });
    const { axis = -1, mean, variance, invert = false } = config;
    this.axis = Array.isArray(axis) ? axis : [axis];
    this.invert = invert;
    this.inputMean = mean != null ? tf.tensor(mean) : null;
    this.inputVariance = variance != null ? tf.tensor(variance) : null;
  }

  build(inputShape: tf.Shape | tf.Shape[]): void {
    const shape = Array.isArray(inputShape)
      ? (inputShape as number[])
      : (inputShape as number[]);
    const ndim = shape.length;

    this.keepAxes = this.axis.map(a => (a < 0 ? a + ndim : a));
    this.reduceAxes = [];
    for (let i = 0; i < ndim; ++i) {
      if (!this.keepAxes.includes(i)) {
        this.reduceAxes.push(i);
      }
    }
    this.meanVarShape = this.keepAxes.map(i => shape[i]);

    if (this.inputMean == null) {
      this.meanVar = this.addWeight(
        'mean', this.meanVarShape, 'float32', tf.initializers.zeros()
      );
      this.varVar = this.addWeight(
        'variance', this.meanVarShape, 'float32', tf.initializers.ones()
      );
      this.addWeight(
        'count', [], 'int32', tf.initializers.zeros()
      )
    }

    super.build(inputShape);
  }

  /**
   * Compute mean and variance from data and store in layer.
   */
  async adapt(data: tf.Tensor): Promise<void> {
    const { mean, variance } = tf.moments(data, this.reduceAxes as number[]);
    if (this.meanVar && this.varVar) {
      this.meanVar.write(mean);
      this.varVar.write(variance);
    } else {
      this.inputMean = mean;
      this.inputVariance = variance;
    }
  }

  call(
    inputs: tf.Tensor | tf.Tensor[],
    _: any
  ): tf.Tensor {
    const x = Array.isArray(inputs) ? inputs[0] : inputs;

    let mean = this.meanVar ? this.meanVar.read() : this.inputMean!;
    let variance = this.varVar ? this.varVar.read() : this.inputVariance!;

    const broadcastShape = x.shape.map((_, i) =>
      this.keepAxes.includes(i) ? x.shape[i] : 1
    );
    mean = mean.reshape(broadcastShape);
    variance = variance.reshape(broadcastShape);

    const eps = tf.backend().epsilon();
    if (this.invert) {
      return tf.add(mean, tf.mul(x, tf.sqrt(tf.maximum(variance, eps))));
    }
    return tf.div(tf.sub(x, mean), tf.sqrt(tf.maximum(variance, eps)));
  }

  computeOutputShape(inputShape: tf.Shape | tf.Shape[]): tf.Shape | tf.Shape[] {
    return inputShape;
  }

  getConfig(): tf.serialization.ConfigDict {
    const baseConfig = super.getConfig();
    const config: tf.serialization.ConfigDict = {
      ...baseConfig,
      axis: this.axis,
      invert: this.invert,
    };
    if (this.inputMean) {
      config.mean = this.inputMean.arraySync();
    }
    if (this.inputVariance) {
      config.variance = this.inputVariance.arraySync();
    }
    return config;
  }
}
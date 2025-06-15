import { Matrix, inverse } from 'ml-matrix';

export class PolynomialRegressionModel {
  // degree можем хранить, но здесь реализовано только для degree = 2
  private readonly degree: number;
  private readonly lambda: number;
  private means: number[] = [];
  private stds: number[] = [];
  private weightsX: number[] = [];
  private weightsY: number[] = [];
  private featureCount: number = 0;

  constructor(degree: number = 2, lambda: number = 0) {
    if (degree !== 2) {
      throw new Error('В текущей реализации поддерживается только степень полинома = 2.');
    }
    this.degree = degree;
    this.lambda = lambda;
  }

  /**
   * Обучение модели. 
   * @param inputs Массив размерности M×9 (сырые признаки без нормализации).
   * @param outputX Целевая координата X (длина M).
   * @param outputY Целевая координата Y (длина M).
   */
  public fit(inputs: number[][], outputX: number[], outputY: number[]): void {
    if (inputs.length === 0) {
      throw new Error('Нет данных для обучения.');
    }
    const M = inputs.length;
    const n = inputs[0].length; // должен быть = 9

    if (n !== 9) {
      throw new Error(`Ожидается 9 компонентов во входном векторе, получено ${n}.`);
    }
    if (outputX.length !== M || outputY.length !== M) {
      throw new Error('Длины inputs, outputX и outputY должны совпадать.');
    }

    // Нормализация: вычисляем mean и std для каждого из 9 признаков
    this.means = new Array(n).fill(0);
    this.stds = new Array(n).fill(0);

    // Вычисляем средние
    for (let j = 0; j < n; j++) {
      let sum = 0;
      for (let i = 0; i < M; i++) {
        sum += inputs[i][j];
      }
      this.means[j] = sum / M;
    }

    // Вычисляем std
    for (let j = 0; j < n; j++) {
      let sumSq = 0;
      for (let i = 0; i < M; i++) {
        const diff = inputs[i][j] - this.means[j];
        sumSq += diff * diff;
      }
      const variance = sumSq / M;
      this.stds[j] = Math.sqrt(variance) || 1; // если варианс = 0, подставляем 1
    }

    // Нормализуем rawX => normX
    const normX: number[][] = new Array(M);
    for (let i = 0; i < M; i++) {
      normX[i] = new Array(n);
      for (let j = 0; j < n; j++) {
        normX[i][j] = (inputs[i][j] - this.means[j]) / this.stds[j];
      }
    }

    // Полиномиальное расширение (degree=2)
    // Каждый вектор normX[i] длины 9 => polyFeatures длины p = 55
    const polyX: number[][] = new Array(M);
    for (let i = 0; i < M; i++) {
      polyX[i] = PolynomialRegressionModel.polynomialFeatures2(normX[i]);
    }
    this.featureCount = polyX[0].length; // 55

    // Строим матрицу X_poly (M×p), а также векторы yx, yy
    const Xmat = new Matrix(polyX); // M × p
    const XT = Xmat.transpose();     // p × M

    // Вектор-столбец yx и yy
    const yxVec = Matrix.columnVector(outputX);
    const yyVec = Matrix.columnVector(outputY);

    // Вычисляем (XᵀX + λI) и Xᵀy
    // A = XᵀX (p×p):
    const A = XT.mmul(Xmat); // p × p
    // Добавляем λ на диагональ, кроме константы, т.к. у нее нет веса, а значит не должно быть штрафа
    if (this.lambda > 0) {
      for (let d = 1; d < A.rows; d++) {
        A.set(d, d, A.get(d, d) + this.lambda);
      }
    }
    // Вектор Bx = Xᵀ yx (p×1), By = Xᵀ yy (p×1)
    const Bx = XT.mmul(yxVec);
    const By = XT.mmul(yyVec);

    // Решаем A * wX = Bx, A * wY = By
    // Предполагаем, что A невырождена (или добавили λ достаточно большой)
    const Ainv = inverse(A); // p × p
    const wXmat = Ainv.mmul(Bx); // p × 1
    const wYmat = Ainv.mmul(By); // p × 1

    this.weightsX = wXmat.getColumn(0);
    this.weightsY = wYmat.getColumn(0);
  }

  /**
   * Предсказание координат экрана по одному новому вектору rawFeature (9 чисел).
   * @param rawFeature [yawLeft, pitchLeft, yawRigth, pitchRigth, xCenterLeft, yCenterLeft, xCenterRigth, yCenterRigth, userToCameraDistance]
   * @returns [predX, predY]
   */
  public predict(rawFeature: number[]): [number, number] {
    if (this.weightsX.length === 0 || this.weightsY.length === 0) {
      throw new Error('Модель не обучена. Сначала вызовите fit() с обучающими данными.');
    }
    if (rawFeature.length !== this.means.length) {
      throw new Error(`Ожидается ${this.means.length} элементов во входном векторе, получено ${rawFeature.length}.`);
    }

    // Нормализация входного вектора по тем же mean/σ
    const n = rawFeature.length;
    const norm: number[] = new Array(n);
    for (let j = 0; j < n; j++) {
      norm[j] = (rawFeature[j] - this.means[j]) / this.stds[j];
    }

    // Полиномиальное расширение
    const polyFeat = PolynomialRegressionModel.polynomialFeatures2(norm); // длина 55

    // Вычисляем dot(weightsX, polyFeat) и dot(weightsY, polyFeat)
    let px = 0;
    let py = 0;
    for (let i = 0; i < this.featureCount; i++) {
      px += this.weightsX[i] * polyFeat[i];
      py += this.weightsY[i] * polyFeat[i];
    }

    return [px, py];
  }

  /**
   * Статический метод для полиномиального расширения степени 2.
   * Нормализованный вектор длины n => массив длины 1 + n + n + n(n−1)/2.
   * @param features Нормализованный вектор из 9 чисел.
   * @returns Полиномиальные признаки (длина 55).
   */
  private static polynomialFeatures2(features: number[]): number[] {
    const n = features.length; // ожидается 9
    const result: number[] = [];

    // Константа
    result.push(1);

    // Линейные термы
    for (let i = 0; i < n; i++) {
      result.push(features[i]);
    }

    // Квадратные термы
    for (let i = 0; i < n; i++) {
      result.push(features[i] * features[i]);
    }

    // Попарные произведения i < j
    for (let i = 0; i < n; i++) {
      for (let j = i + 1; j < n; j++) {
        result.push(features[i] * features[j]);
      }
    }

    return result;
  }

  /**
   * Сохраняет обученные параметры модели в localStorage.
   * @param storageKey — ключ для localStorage
   */
  public saveModel(storageKey: string): void {
    if (this.weightsX.length === 0 || this.weightsY.length === 0) {
      throw new Error('Модель ещё не обучена — нечего сохранять.');
    }
    const payload = {
      degree: this.degree,
      lambda: this.lambda,
      means: this.means,
      stds: this.stds,
      weightsX: this.weightsX,
      weightsY: this.weightsY,
      featureCount: this.featureCount
    };
    try {
      localStorage.setItem(storageKey, JSON.stringify(payload));
    } catch (e) {
      throw new Error(`Не удалось сохранить модель в localStorage: ${e}`);
    }
  }

  /**
   * Загружает параметры модели из localStorage.
   * @param storageKey — ключ, под которым модель была сохранена
   * @returns true, если загрузка успешна, false — иначе
   */
  public loadModel(storageKey: string): boolean {
    const item = localStorage.getItem(storageKey);
    if (!item) {
      return false;
    }
    try {
      const obj = JSON.parse(item);
      // Проверяем, что degree и lambda совпадают
      if (obj.degree !== this.degree || obj.lambda !== this.lambda) {
        console.warn(
          `Несовпадение конфигурации: сохранён degree=${obj.degree}, lambda=${obj.lambda}, ` +
          `а у текущей модели degree=${this.degree}, lambda=${this.lambda}.`
        );
        return false
      }

      this.means = obj.means;
      this.stds = obj.stds;
      this.weightsX = obj.weightsX;
      this.weightsY = obj.weightsY;
      this.featureCount = obj.featureCount;
      return true;
    } catch (e) {
      console.error(`Ошибка при разборе данных модели из localStorage: ${e}`);
      return false;
    }
  }
}
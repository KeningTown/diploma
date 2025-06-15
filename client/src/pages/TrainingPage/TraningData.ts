export interface IPoint {
  x: number;
  y: number;
}

export function getGridPoints(cols:number, rows:number): IPoint[] {
  const w = window.innerWidth;
  const h = window.innerHeight;
  const points = [];

  const cellWidth = w / cols;
  const cellHeight = h / rows;

  for (let i = 0; i < rows; i++) {
    for (let j = 0; j < cols; j++) {
      let x = (j + 0.5) * cellWidth;
      const y = (i + 0.5) * cellHeight;
          
      points.push({ x, y });
    }
  }

  return points;
}

/**
 * Генерирует змейковую (горизонтальную) траекторию внутри заданного прямоугольника [left..right]×[top..bottom].
 * startFromLeft = true  — значит, первая точка каждой новой строки лежит в левом столбце (x = left),
 * startFromLeft = false — в правом (x = right).
 * 
 * В качестве «высоты шага» по вертикали берётся stepY.
 */
function generateSnakeInRect(
  left: number,
  right: number,
  top: number,
  bottom: number,
  stepY: number,
  startFromLeft: boolean
): IPoint[] {
  const pts: IPoint[] = [];
  let directionLeftToRight = startFromLeft;

  for (let y = top; y <= bottom; y += stepY) {
    if (directionLeftToRight) {
      pts.push({ x: left, y });
      pts.push({ x: right, y });
    } else {
      pts.push({ x: right, y });
      pts.push({ x: left, y });
    }
    directionLeftToRight = !directionLeftToRight;
  }

  return pts;
}

function generateOuterSpiral(
  screenWidth: number,
  screenHeight: number,
  margin: number,
  step: number
): IPoint[] {
  let leftX = margin;
  let rightX = screenWidth - margin;
  let topY = margin;
  let bottomY = screenHeight - margin;

  const points: IPoint[] = [];
  let direction: "left" | "right" = "right";
  let x = leftX;
  let y = topY;
  points.push({ x, y });

  // Внешний виток змейки
  while (true) {
    x = direction === "left" ? leftX : rightX;
    points.push({ x, y });

    const nextY = y + step;
    if (nextY > bottomY) break;

    points.push({ x, y: nextY });
    y = nextY;
    direction = direction === "left" ? "right" : "left";
  }

  // Сдвиг границ внутрь
  leftX += step;
  rightX -= step;
  topY += step;
  bottomY -= step;

  // Диагональный переход к началу внутренней змейки
  if (points.length > 0) {
    points.push({ x: leftX, y: topY });
    x = leftX;
    y = topY;
    // переставляем направление, чтобы следующий push был не тот же самый
    direction = "right";
  }

  // Внутренний виток змейки
  while (leftX < rightX && topY < bottomY) {
    x = direction === "left" ? leftX : rightX;
    points.push({ x, y });

    const nextY = y + step;
    if (nextY > bottomY) break;

    points.push({ x, y: nextY });
    y = nextY;
    direction = direction === "left" ? "right" : "left";

    // проверка на переход к новому слою
    if ((direction === "left" && x === leftX) || (direction === "right" && x === rightX)) {
      if (y + step > bottomY) {
        leftX += step;
        rightX -= step;
        topY += step;
        bottomY -= step;

        if (!(leftX < rightX && topY < bottomY)) break;

        points.push({ x: leftX, y: topY });
        direction = "left";
      }
    }
  }

  // зеркальный возврат к старту
  const forwardPoints = [...points];
  for (let i = forwardPoints.length - 2; i >= 0; i--) {
    points.push(forwardPoints[i]);
  }

  return points;
}

/**
 * Собирает всю итоговую траекторию без дублирующих подряд точек:
 */
export function generateFullTrajectory(): IPoint[] {
  const w = window.innerWidth;
  const h = window.innerHeight;
  const margin = 100;
  const step = w / 10;

  const centralLeft = w * 0.2;
  const centralRight = w * 0.8;
  const centralTop = h * 0.2;
  const centralBottom = h * 0.6;

  const allPts: IPoint[] = [];
  // старт
  allPts.push({ x: margin, y: margin });

  // змейка в центре (без ручного начала)
  const centralSnake = generateSnakeInRect(
    centralLeft,
    centralRight,
    centralTop,
    centralBottom,
    step,
    true
  );
  allPts.push(...centralSnake);

  // возврат к старту
  allPts.push({ x: margin, y: margin });

  // внешняя спираль
  const outerSpiral = generateOuterSpiral(w, h, margin, step);
  outerSpiral.shift();
  allPts.push(...outerSpiral);

  return allPts;
}

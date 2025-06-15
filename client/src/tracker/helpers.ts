export const getHypot = (a: number, b: number) => {
  return Math.sqrt(a * a + b * b)
}

export const degToRad = (deg: number) => {
  return deg * (Math.PI / 180)
}

export type Point2D = { x: number, y: number };

export type IntrinsicParams = { 
    focalLength:{
        x: number,
        y: number
    },
    principlePoint: Point2D 
};

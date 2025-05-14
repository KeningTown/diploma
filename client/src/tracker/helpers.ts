export const getHypot = (a: number, b: number) => {
  return Math.sqrt(a * a + b * b)
}

export const degToRad = (deg: number) => {
  return deg * (Math.PI / 180)
}

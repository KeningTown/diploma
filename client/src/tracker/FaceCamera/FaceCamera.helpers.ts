export const getFocalLength = (diagonal: number, diagonalFov: number) => {
  return (diagonal / 2) * (1 / Math.tan(diagonalFov / 2))
}

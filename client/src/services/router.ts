export const buildPath = (to: string, params?: Record<string, unknown>) => {
  if (!params) {
    return to
  }

  let path = `${to}`

  Object.entries(params).forEach(([key, value]) => {
    path = path.replace(`:${key}`, String(value))
  })

  return path
}

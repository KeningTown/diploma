import { nanoid } from 'nanoid'

const SIZE = 8

export const getUniqueId = () => {
  return nanoid(SIZE)
}

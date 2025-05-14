import { Collection } from './permission.types'

export const getEntityActionIdMap = (permissions: Collection) => {
  return permissions.reduce<Record<string, Record<string, number>>>(
    (obj, { entity, action, id }) => {
      if (!obj[entity]) {
        obj[entity] = {}
      }

      obj[entity][action] = id

      return obj
    },
    {}
  )
}

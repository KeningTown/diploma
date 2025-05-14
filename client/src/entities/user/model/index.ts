import * as constants from './user.constants'
import { api } from './user.api'
import * as service from './user.service'

export const user = {
  constants,
  api,
  service
}

export * as UserProps from './user.types'

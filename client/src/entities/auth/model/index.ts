import * as constants from './auth.constants'
import { api } from './auth.api'
import * as service from './auth.service'

export const auth = {
  constants,
  api,
  service
}

export * as AuthProps from './auth.types'

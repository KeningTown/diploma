import { User } from '../user.entity'

export class UserDto {
  id!: number

  firstName!: string

  lastName!: string

  middleName!: string

  email!: string

  active!: boolean

  refreshToken?: string

  constructor(user: User) {
    this.id = user.id
    this.firstName = user.firstName
    this.lastName = user.lastName
    this.middleName = user.middleName
    this.email = user.email
    this.active = user.active
    this.refreshToken = user.refreshToken
  }
}

import { User } from '../../users/user.entity'

export class RoleUserDto {
  id!: number

  firstName!: string

  lastName!: string

  middleName!: string

  constructor(user: User) {
    this.id = user.id
    this.firstName = user.firstName
    this.lastName = user.lastName
    this.middleName = user.middleName
  }
}

export class AddUserDto {
  id!: number

  firstName!: string

  lastName!: string

  middleName!: string

  password!: string

  email!: string

  active!: boolean

  createdBy?: number
}

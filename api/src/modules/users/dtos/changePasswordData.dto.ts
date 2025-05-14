export class ChangePasswordDataDto {
  readonly password!: string
  readonly updatedAt!: Date

  constructor(password: string, updatedAt: Date) {
    this.password = password
    this.updatedAt = updatedAt
  }
}

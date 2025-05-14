export class UpdateEntityDataDto {
  readonly updatedAt!: Date

  constructor(updatedAt: Date) {
    this.updatedAt = updatedAt
  }
}

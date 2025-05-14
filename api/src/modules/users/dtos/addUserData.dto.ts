import { AddEntityDataDto } from '../../common/dtos/addEntityData.dto'

export class AddUserDataDto extends AddEntityDataDto {
  readonly password!: string

  constructor(id: number, createdAt: Date, password: string) {
    super(id, createdAt)
    this.password = password
  }
}

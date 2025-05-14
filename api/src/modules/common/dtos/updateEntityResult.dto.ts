import { UpdateEntityDataDto } from './updateEntityData.dto'
import { UpdateEntityResultParamsDto } from './updateEntityResultParams.dto'

export class UpdateEntityResultDto<T = UpdateEntityDataDto> {
  readonly success!: boolean

  readonly message!: string

  readonly data?: T

  constructor(params: UpdateEntityResultParamsDto<T>) {
    this.success = params.data != null
    this.message = this.success ? params.successMessage : params.errorMessage
    if (params.data != null) {
      this.data = params.data
    }
  }
}

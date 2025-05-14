import { AddEntityDataDto } from './addEntityData.dto'

export class AddEntityResultDto<T = AddEntityDataDto> {
  readonly success: boolean
  readonly message: string
  readonly data?: T

  constructor({
    data,
    successMessage = 'Successfully created',
    errorMessage = 'Entity was not created!'
  }: {
    data?: T
    successMessage?: string
    errorMessage?: string
  }) {
    const success = data !== undefined

    this.success = success
    this.message = success ? successMessage : errorMessage
    this.data = data
  }
}

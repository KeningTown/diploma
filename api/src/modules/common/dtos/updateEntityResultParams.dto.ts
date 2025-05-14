export class UpdateEntityResultParamsDto<T> {
  readonly successMessage?: string = 'Successfully updated'

  readonly errorMessage?: string = 'Entity was not updated!'

  readonly data?: T
}

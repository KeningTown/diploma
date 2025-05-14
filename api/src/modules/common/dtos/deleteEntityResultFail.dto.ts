import { DeleteEntityResultDto } from './deleteEntityResult.dto'

export class DeleteEntityResultFailDto extends DeleteEntityResultDto {
  constructor(message: string) {
    super(false, message)
  }
}

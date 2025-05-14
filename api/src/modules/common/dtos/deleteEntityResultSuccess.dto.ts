import { DeleteEntityResultDto } from './deleteEntityResult.dto'

export class DeleteEntityResultSuccessDto extends DeleteEntityResultDto {
  constructor(message = 'Deleted successfully') {
    super(true, message)
  }
}

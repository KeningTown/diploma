import { Module } from '@nestjs/common'
import { OrmModule } from '../orm/orm.module'
import AttachmentsController from './attachments.controller'
import AttachmentsService from './attachments.service'

@Module({
  imports: [OrmModule],
  controllers: [AttachmentsController],
  providers: [AttachmentsService]
})
export class AttachmentsModule {}

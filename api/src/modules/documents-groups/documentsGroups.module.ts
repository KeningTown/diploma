import { Module } from '@nestjs/common'
import { OrmModule } from '../orm/orm.module'
import DocumentsGroupsController from './documentsGroups.controller'
import DocumentsGroupsService from './documentsGroups.service'

@Module({
  imports: [OrmModule],
  controllers: [DocumentsGroupsController],
  providers: [DocumentsGroupsService]
})
export class DocumentsGroupsModule {}

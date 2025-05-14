import { Module } from '@nestjs/common'
import { OrmModule } from '../orm/orm.module'
import GroupsService from './groups.service'
import GroupsController from './groups.controller'

@Module({
  imports: [OrmModule],
  providers: [GroupsService],
  controllers: [GroupsController]
})
export class GroupsModule {}

import { Module } from '@nestjs/common'
import { OrmModule } from '../orm/orm.module'
import UsersGroupsController from './usersGroups.controller'
import UsersGroupsService from './usersGroups.service'

@Module({
  imports: [OrmModule],
  controllers: [UsersGroupsController],
  providers: [UsersGroupsService]
})
export class UsersGroupsModule {}

import { Module } from '@nestjs/common'
import { OrmModule } from '../orm/orm.module'
import UsersRolesController from './usersRoles.controller'
import UsersRolesService from './usersRoles.service'

@Module({
  imports: [OrmModule],
  controllers: [UsersRolesController],
  providers: [UsersRolesService]
})
export class UsersRolesModule {}

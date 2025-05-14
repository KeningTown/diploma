import { Module } from '@nestjs/common'
import UsersService from './users.service'
import UsersController from './users.controller'
import { OrmModule } from '../orm/orm.module'

@Module({
  imports: [OrmModule],
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService]
})
export class UsersModule {}

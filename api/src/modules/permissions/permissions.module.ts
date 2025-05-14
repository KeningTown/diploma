import { Module } from '@nestjs/common'
import { OrmModule } from '../orm/orm.module'
import PermissionsController from './permissions.controller'
import PermissionsService from './permissions.service'

@Module({
  imports: [OrmModule],
  controllers: [PermissionsController],
  providers: [PermissionsService]
})
export class PermissionsModule {}

import { Module } from '@nestjs/common'
import { OrmModule } from '../orm/orm.module'
import RolesPermissionsService from './rolesPermissions.service'
import RolesPermissionsController from './rolesPermissions.controller'

@Module({
  imports: [OrmModule],
  controllers: [RolesPermissionsController],
  providers: [RolesPermissionsService]
})
export class RolesPermissionsModule {}

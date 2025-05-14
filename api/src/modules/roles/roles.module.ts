import { Module } from '@nestjs/common'
import RolesService from './roles.service'
import RolesController from './roles.controller'
import { OrmModule } from '../orm/orm.module'

@Module({
  imports: [OrmModule],
  controllers: [RolesController],
  providers: [RolesService]
})
export class RolesModule {}

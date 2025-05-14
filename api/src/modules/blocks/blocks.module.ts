import { Module } from '@nestjs/common'
import { OrmModule } from '../orm/orm.module'
import BlocksController from './blocks.controller'
import BlocksService from './blocks.service'

@Module({
  imports: [OrmModule],
  controllers: [BlocksController],
  providers: [BlocksService]
})
export class BlocksModule {}

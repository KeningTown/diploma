import { Module } from '@nestjs/common'

import { OrmModule } from '../orm/orm.module'
import { AuthModule } from '../auth/auth.module'

import { RecordController } from './record.controller'

import { RecordService } from './record.service'

@Module({
  imports: [OrmModule, AuthModule],
  controllers: [RecordController],
  providers: [RecordService]
})
export class RecordModule {}

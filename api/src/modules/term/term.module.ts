import { Module } from '@nestjs/common'

import { OrmModule } from '../orm/orm.module'

import { TermController } from './term.controller'

import { TermService } from './term.service'

@Module({
  imports: [OrmModule],
  controllers: [TermController],
  providers: [TermService],
  exports: [TermService]
})
export class TermModule {}

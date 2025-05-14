import { Module } from '@nestjs/common'

import { OrmModule } from '../orm/orm.module'

import { TermRelationController } from './termRelation.controller'

import { TermRelationService } from './termRelation.service'

@Module({
  imports: [OrmModule],
  controllers: [TermRelationController],
  providers: [TermRelationService],
  exports: [TermRelationService]
})
export class TermRelationModule {}

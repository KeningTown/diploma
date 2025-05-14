import { Module } from '@nestjs/common'

import { OrmModule } from '../orm/orm.module'
import { TermRelationModule } from '../termRelation/termRelation.module'

import { TermAnalysisController } from './termAnalysis.controller'

import { TermAnalysisService } from './termAnalysis.service'

@Module({
  imports: [OrmModule, TermRelationModule],
  controllers: [TermAnalysisController],
  providers: [TermAnalysisService]
})
export class TermAnalysisModule {}

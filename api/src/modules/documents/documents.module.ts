import { Module } from '@nestjs/common'

import { OrmModule } from '../orm/orm.module'
import { AuthModule } from '../auth/auth.module'
import { TermModule } from '../term/term.module'

import DocumentsController from './documents.controller'

import DocumentsService from './documents.service'

@Module({
  imports: [OrmModule, AuthModule, TermModule],
  controllers: [DocumentsController],
  providers: [DocumentsService]
})
export class DocumentsModule {}

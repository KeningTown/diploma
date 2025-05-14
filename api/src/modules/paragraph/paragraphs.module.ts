import { Module } from '@nestjs/common'
import { OrmModule } from '../orm/orm.module'
import ParagraphsController from './paragraphs.controller'
import ParagraphsService from './paragraphs.service'

@Module({
  imports: [OrmModule],
  controllers: [ParagraphsController],
  providers: [ParagraphsService]
})
export class ParagraphsModule {}

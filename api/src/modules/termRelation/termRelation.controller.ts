import {
  ClassSerializerInterceptor,
  Controller,
  UseInterceptors,
  Param,
  ParseIntPipe,
  Delete,
  Body,
  Post,
  UseGuards
} from '@nestjs/common'

import { CreateData } from './termRelation.types'

import { TermRelationService } from './termRelation.service'
import { AccessTokenGuard } from '../common/guards/accessToken.guard'

@UseInterceptors(ClassSerializerInterceptor)
@UseGuards(AccessTokenGuard)
@Controller('api/termsRelations')
export class TermRelationController {
  constructor(private readonly termRelationService: TermRelationService) {}

  @Post()
  async create(@Body() data: CreateData) {
    return await this.termRelationService.create(data)
  }

  @Delete('/:termRelationId')
  async delete(@Param('termRelationId', ParseIntPipe) id: number) {
    return await this.termRelationService.delete(id)
  }
}

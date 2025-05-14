import {
  ClassSerializerInterceptor,
  Controller,
  UseInterceptors,
  Get,
  Query,
  Post,
  UseGuards
} from '@nestjs/common'

import { ListQueryParams } from './termAnalysis.types'

import { TermAnalysisService } from './termAnalysis.service'
import { AccessTokenGuard } from '../common/guards/accessToken.guard'

@UseInterceptors(ClassSerializerInterceptor)
@UseGuards(AccessTokenGuard)
@Controller('api/termAnalyzes')
export class TermAnalysisController {
  constructor(private readonly termAnalysisService: TermAnalysisService) {}

  @Get()
  async list(@Query() params: ListQueryParams) {
    return await this.termAnalysisService.list(params)
  }

  @Post()
  async create() {
    return await this.termAnalysisService.create()
  }
}

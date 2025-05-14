import {
  ClassSerializerInterceptor,
  Controller,
  UseInterceptors,
  Get,
  Query,
  Param,
  ParseIntPipe,
  Delete,
  Patch,
  Body,
  Post,
  UseGuards
} from '@nestjs/common'

import { ListQueryParams, CreateData } from './term.types'

import { TermService } from './term.service'
import { AccessTokenGuard } from '../common/guards/accessToken.guard'

@UseInterceptors(ClassSerializerInterceptor)
@UseGuards(AccessTokenGuard)
@Controller('api/terms')
export class TermController {
  constructor(private readonly termService: TermService) {}

  @Get()
  async list(@Query() params: ListQueryParams) {
    return await this.termService.list(params)
  }

  @Get('/:termId')
  async read(@Param('termId', ParseIntPipe) id: number) {
    return await this.termService.read(id)
  }

  @Get('/definition/:termId')
  async readDefinition(@Param('termId', ParseIntPipe) id: number) {
    return await this.termService.readDefinition(id)
  }

  @Post()
  async create(@Body() data: CreateData) {
    return await this.termService.create(data)
  }

  @Patch('/:termId')
  async update(
    @Param('termId', ParseIntPipe) id: number,
    @Body() data: CreateData
  ) {
    return await this.termService.update(id, data)
  }

  @Delete('/:termId')
  async delete(@Param('termId', ParseIntPipe) id: number) {
    return await this.termService.delete(id)
  }
}

import { Injectable, HttpException, HttpStatus } from '@nestjs/common'
import { EntityManager } from '@mikro-orm/postgresql'
import * as fs from 'fs'
import * as path from 'path'

import { ListQueryParams, CreateData } from './record.types'

import { Record } from './record.entity'

import { RecordDto } from './dtos/record.dto'
import { ListDto } from '../common/dtos/list.dto'
import { AddEntityResultDto } from '../common/dtos/addEntityResult.dto'

import { AuthService } from '../auth/auth.service'

export const RECORDS_DIR = path.resolve('./records')

@Injectable()
export class RecordService {
  constructor(
    private readonly em: EntityManager,
    private readonly authService: AuthService
  ) {}

  async list({ limit = 50, offset = 0 }: ListQueryParams) {
    try {
      const [records, count] = await this.em.findAndCount(
        Record,
        {},
        {
          limit,
          offset,
          populate: ['user', 'document'],
          orderBy: { createdAt: 'desc' }
        }
      )

      const data = records.map((term) => new RecordDto(term))

      return new ListDto(data, { count, limit, offset })
    } catch (e) {
      throw new HttpException(
        { success: false, message: e.message },
        HttpStatus.BAD_REQUEST
      )
    }
  }

  async read(id: number) {
    try {
      const record = await this.em.findOneOrFail(
        Record,
        {
          id
        },
        {
          populate: ['user', 'document']
        }
      )

      try {
        const file = fs.readFileSync(
          `${RECORDS_DIR}/${record.filename}`,
          'utf-8'
        )
        const data = JSON.parse(file)

        return new RecordDto(record, data)
      } catch (e) {
        throw new Error(e)
      }
    } catch (e) {
      throw new HttpException(
        { success: false, message: e.message },
        HttpStatus.BAD_REQUEST
      )
    }
  }

  async create(authHeader: string, { documentId, filename }: CreateData) {
    try {
      const user = this.authService.getUserFromAuthHeader(authHeader)
      const record = this.em.create(Record, {
        user: user.id,
        document: documentId,
        filename
      })

      await this.em.flush()

      return new AddEntityResultDto({
        data: { id: record.id, createdAt: record.createdAt }
      })
    } catch (e) {
      throw new HttpException(
        new AddEntityResultDto({
          errorMessage: e.message
        }),
        HttpStatus.BAD_REQUEST
      )
    }
  }
}

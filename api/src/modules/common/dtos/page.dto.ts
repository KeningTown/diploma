export class PageDto {
  constructor(count: number, limit: number, offset: number) {
    this.count = count
    this.limit = limit
    this.offset = offset
  }

  readonly count!: number

  readonly limit!: number

  readonly offset!: number
}

import { PageDto } from './page.dto'

export class ListDto<D> {
  data: D
  nav: PageDto

  constructor(
    data: D,
    nav: {
      count: number
      limit: number
      offset: number
    }
  ) {
    this.data = data
    this.nav = new PageDto(nav.count, nav.limit, nav.offset)
  }
}

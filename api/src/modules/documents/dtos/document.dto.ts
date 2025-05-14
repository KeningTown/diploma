import { Document } from '../document.entity'

export class DocumentDto {
  id: number
  title: string
  abstract: string

  constructor(document: Document) {
    this.id = document.id
    this.title = document.title
    this.abstract = document.abstract
  }
}

export enum RelationType {
  HAS_A = 'has-a', // целое -> часть
  PART_OF = 'part-of', // часть -> целое

  CLASS_OF = 'class-of', // общее -> частное
  INSTANCE_OF = 'instance-of', // частное -> общее (is-a)

  EQ_TO = 'eq-to' // синоним
}

export type CreateData = {
  termId: number
  relation: {
    type: RelationType
    termId: number
  }
}[]

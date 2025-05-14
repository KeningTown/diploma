import React from 'react'

import { TagProps } from '@/ui'

export enum RelationType {
  HAS_A = 'has-a', // целое -> часть
  PART_OF = 'part-of', // часть -> целое

  CLASS_OF = 'class-of', // общее -> частное
  INSTANCE_OF = 'instance-of', // частное -> общее (is-a)

  EQ_TO = 'eq-to' // синоним
}

export const OPPOSITE_RELATION_TYPE = {
  [RelationType.EQ_TO]: RelationType.EQ_TO,
  [RelationType.CLASS_OF]: RelationType.INSTANCE_OF,
  [RelationType.INSTANCE_OF]: RelationType.CLASS_OF,
  [RelationType.HAS_A]: RelationType.PART_OF,
  [RelationType.PART_OF]: RelationType.HAS_A
} as const

export const RELATION_TYPE_GRAPH_RU = {
  [RelationType.HAS_A]: 'состоит из',
  [RelationType.PART_OF]: 'часть',
  [RelationType.CLASS_OF]: 'класс',
  [RelationType.INSTANCE_OF]: 'экземпляр',
  [RelationType.EQ_TO]: 'синоним'
} as const

export const RELATION_TYPE_COLOR: Record<RelationType, TagProps['color']> = {
  [RelationType.HAS_A]: 'geekblue',
  [RelationType.PART_OF]: 'blue',
  [RelationType.CLASS_OF]: 'purple',
  [RelationType.INSTANCE_OF]: 'magenta',
  [RelationType.EQ_TO]: 'green'
}

export const RELATION_TYPE_RU = {
  [RelationType.EQ_TO]: 'Синонимы',
  [RelationType.CLASS_OF]: 'Гиперонимы',
  [RelationType.INSTANCE_OF]: 'Гипонимы',
  [RelationType.HAS_A]: 'Холонимы',
  [RelationType.PART_OF]: 'Меронимы'
} as const

export const RELATION_TYPE_DEFINITION_RU = {
  [RelationType.EQ_TO]: (
    <>
      Синоним &mdash; понятие, совпадающее или близкое по значению с другим
      понятием. Например, понятия «доктор» и «врач» являются синонимами по
      отношению друг к другу
    </>
  ),
  [RelationType.CLASS_OF]: (
    <>
      Гипероним &mdash; понятие, выражающее более общую сущность другого
      понятия. Например, понятие «зверь» является гиперонимом по отношению к
      понятию «собака»
    </>
  ),
  [RelationType.INSTANCE_OF]: (
    <>
      Гипоним &mdash; понятие, выражающее частную сущность другого понятия.
      Например, понятие «кошка» является гипонимом по отношению к понятию
      «животное»
    </>
  ),
  [RelationType.HAS_A]: (
    <>
      Холоним &mdash; понятие, которое является целым над другим понятием.
      Например, понятие «автомобиль» является холонимом по отношению к понятию
      «двигатель»
    </>
  ),
  [RelationType.PART_OF]: (
    <>
      Мероним &mdash; понятие, которое является составной частью другого
      понятия. Например, понятие «колесо» является меронимом по отношению к
      понятию «автомобиль»
    </>
  )
}

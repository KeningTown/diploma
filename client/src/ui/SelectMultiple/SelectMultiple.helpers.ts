import { Option, Options, OptionsMapper } from './SelectMultiple.types'

export const getOptions = <T>(
  items: T[] | undefined,
  optionsMapper: OptionsMapper<T>,
  selectedItems: Option[] | undefined,
  excluded?: number[]
) => {
  if (!items) {
    return []
  }

  return items
    .map(optionsMapper)
    .filter(
      ({ value }) =>
        !excluded?.includes(value) &&
        !selectedItems?.some((item) => item.value === value)
    )
}

export const getSelectedOptions = <T extends { id: number }>(
  value: number[] | undefined,
  items: T[],
  optionsMapper: OptionsMapper<T>
): Options => {
  if (!value) {
    return []
  }

  return value.map((v) => {
    const item = items.find(({ id }) => id === v)!

    return optionsMapper(item)
  })
}

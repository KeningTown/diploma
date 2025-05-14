import { Options } from '../SelectMultiple/SelectMultiple.types'
import { DataToOptions } from './SearchMultiple.types'

export const getOptions = <T>(
  data: T | undefined,
  dataToOptions: DataToOptions<T>,
  searchValue: string,
  value?: Options,
  excluded?: number[]
) => {
  if (!data) {
    return []
  }

  return dataToOptions(data, searchValue).filter(
    (item) =>
      !excluded?.includes(item.value) &&
      !value?.some((i) => i.value === item.value)
  )
}

import React, { useState, useMemo, useEffect, useCallback } from 'react'
import { Select } from 'antd'

import { SelectMultipleProps, Option, Options } from './SelectMultiple.types'

import { getOptions, getSelectedOptions } from './SelectMultiple.helpers'

import { useRequest } from '@/hooks'

function SelectMultiple<T extends { id: number }>({
  ref,
  value,
  excluded,
  request,
  dataDecorator,
  optionsMapper,
  onChange
}: SelectMultipleProps<T>) {
  const { data, isLoading } = useRequest(request, [])

  const items = useMemo(() => {
    if (!data) return undefined
    if (dataDecorator) return dataDecorator(data)

    return data as T[]
  }, [data, dataDecorator])

  const [selectedItems, setSelectedItems] = useState<Options>()

  const options = useMemo(
    () => getOptions(items, optionsMapper, selectedItems, excluded),
    [items, optionsMapper, selectedItems, excluded]
  )

  useEffect(() => {
    if (selectedItems || !items) return

    setSelectedItems(getSelectedOptions(value, items, optionsMapper))
  }, [items, optionsMapper, selectedItems, value])

  const handleChange = useCallback(
    (value: Options, options: Option | Options) => {
      if (!items) return

      const v = value.map(({ value }) => value)

      onChange &&
        onChange(
          items.filter(({ id }) => v.includes(id)),
          options
        )
      setSelectedItems(getSelectedOptions(v, items, optionsMapper))
    },
    [items, onChange, optionsMapper]
  )

  return (
    <Select
      ref={ref}
      labelInValue
      mode="multiple"
      optionFilterProp="label"
      notFoundContent={null}
      loading={isLoading}
      options={options}
      value={selectedItems}
      onChange={handleChange}
    />
  )
}

export default SelectMultiple

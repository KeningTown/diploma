import React, { useState, useEffect, useMemo, useCallback } from 'react'
import { useDebounce } from 'use-debounce'
import { Select } from 'antd'

import { Options, Option } from '../SelectMultiple/SelectMultiple.types'
import { SearchMultipleProps } from './SearchMultiple.types'

import { getOptions } from './SearchMultiple.helpers'

import { useRequest } from '@/hooks'

function SearchMultiple<T>({
  ref,
  value,
  excluded,
  api,
  getApiArgs,
  dataToOptions,
  optionRender,
  onChange
}: SearchMultipleProps<T>) {
  const { request, data, isLoading } = useRequest(api)

  const [searchValue, setSearchValue] = useState('')
  const [debouncedSearchValue, { isPending }] = useDebounce(searchValue, 1000)

  useEffect(() => {
    if (!debouncedSearchValue) return

    request(...getApiArgs(debouncedSearchValue))
  }, [getApiArgs, request, debouncedSearchValue])

  const options = useMemo(
    () => getOptions(data, dataToOptions, searchValue, value, excluded),
    [data, dataToOptions, searchValue, value, excluded]
  )

  const handleSearch = (value: string) => {
    setSearchValue(value)
  }

  const handleChange = useCallback(
    (value: Options, options: Option | Options) => {
      if (!data || !onChange) return

      onChange(value, options)
      setSearchValue('')
    },
    [data, onChange]
  )

  return (
    <Select
      ref={ref}
      labelInValue
      showSearch
      mode="multiple"
      optionFilterProp="searchValue"
      notFoundContent={null}
      searchValue={searchValue}
      loading={isLoading || isPending()}
      options={options}
      value={value}
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      optionRender={optionRender as any}
      onSearch={handleSearch}
      onChange={handleChange}
    />
  )
}

export default SearchMultiple

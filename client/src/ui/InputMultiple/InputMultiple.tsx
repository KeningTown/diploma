import React, { useState, useMemo, useCallback } from 'react'
import { Select, SelectProps, RefSelectProps } from 'antd'

type Value = string[] | undefined

type Props = Omit<SelectProps, 'value' | 'onChange'> & {
  ref?: React.Ref<RefSelectProps>
  value?: Value
  onChange?: (value: Value) => void
}

const InputMultiple: React.FC<Props> = ({ ref, value, onChange, ...rest }) => {
  const [searchValue, setSearchValue] = useState<string>()

  const options = useMemo(
    () =>
      searchValue ? [{ value: searchValue, label: searchValue }] : undefined,
    [searchValue]
  )

  const handleSearch = useCallback((value: string) => {
    setSearchValue(value)
  }, [])

  const handleChange = useCallback(
    (value: Value) => {
      setSearchValue(undefined)
      onChange && onChange(value?.length ? value : undefined)
    },
    [onChange]
  )

  const handleDropdown = useCallback(
    (open: boolean) => {
      if (!searchValue || open) return

      handleChange([...(value || []), searchValue])
    },
    [handleChange, searchValue, value]
  )

  return (
    <Select
      ref={ref}
      {...rest}
      allowClear
      showSearch
      mode="multiple"
      notFoundContent={null}
      value={value}
      options={options}
      searchValue={searchValue}
      onSearch={handleSearch}
      onChange={handleChange}
      onDropdownVisibleChange={handleDropdown}
    />
  )
}

export default InputMultiple

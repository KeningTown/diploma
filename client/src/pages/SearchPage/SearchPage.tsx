import React from 'react'
import { Input } from 'antd'

const SearchPage: React.FC = () => {
  return (
    <Input.Search size="large" placeholder="Поиск по документам и словарю" />
  )
}

export default SearchPage

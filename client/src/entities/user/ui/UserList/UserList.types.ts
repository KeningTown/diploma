import { TableProps } from 'antd'

import { UserProps } from '../../model'

export type Item = UserProps.ItemFull

export type Columns = TableProps<Item>['columns']

import { TableProps } from 'antd'

import { GroupProps } from '../../model'

export type Data = GroupProps.Item

export type Columns = TableProps<Data>['columns']

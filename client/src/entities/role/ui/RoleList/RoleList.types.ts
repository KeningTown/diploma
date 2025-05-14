import { TableProps } from 'antd'

import { RoleProps } from '../../model'

export type Data = RoleProps.Item

export type Columns = TableProps<Data>['columns']
